import {
  Component,
  computed,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { Course } from '../../../core/models/models';
import {
  capitalizeWords,
  categoryColors,
  categoryIconSvg,
  levelFilledDots,
  uploadedFileUrl,
} from '../../../core/utils';

/* ---------------------------------------------------------------
   Fallback content keyed by category (lower-cased).
   Used when the backend does not yet return structured fields.
   --------------------------------------------------------------- */
interface CourseFallback {
  description: string;
  whatYouWillLearn: string[];
  requirements: string[];
  tools: string[];
  /** YouTube video ID */
  videoId: string;
}

const FALLBACKS: Record<string, CourseFallback> = {
  'web': {
    description:
      'Dive into modern web development and build real-world, responsive websites from scratch. This course blends theory with hands-on projects so you leave with a portfolio you\'re proud of.',
    whatYouWillLearn: [
      'Build semantic, accessible HTML pages',
      'Style with modern CSS: Flexbox, Grid, animations',
      'Write interactive JavaScript and DOM manipulation',
      'Deploy a live website to the internet',
    ],
    requirements: [
      'A computer with internet access',
      'No prior experience needed — we start from scratch',
    ],
    tools: ['HTML5', 'CSS3', 'JavaScript', 'VS Code', 'Git'],
    videoId: 'zJSY8tbf_ys',
  },
  'frontend': {
    description:
      'Master the art of crafting beautiful, performant user interfaces using the latest frontend frameworks and design principles. You\'ll build interactive SPAs and learn component-driven architecture.',
    whatYouWillLearn: [
      'Understand component-based UI architecture',
      'Manage state with signals and reactive patterns',
      'Integrate REST APIs and handle async data',
      'Write unit tests and debug like a pro',
    ],
    requirements: [
      'Basic HTML & CSS knowledge',
      'Fundamental JavaScript understanding',
    ],
    tools: ['Angular', 'TypeScript', 'RxJS', 'Jasmine', 'VS Code'],
    videoId: 'k5E2AVpwsko',
  },
  'backend': {
    description:
      'Go behind the scenes and learn how web servers, databases, and APIs are built. You\'ll design RESTful services, handle authentication, and deploy a production-ready Node.js application.',
    whatYouWillLearn: [
      'Build REST APIs with Express.js',
      'Connect and query MongoDB / SQL databases',
      'Implement JWT authentication & authorization',
      'Write middleware, error handlers, and tests',
    ],
    requirements: [
      'Basic JavaScript knowledge',
      'Familiarity with the command line',
    ],
    tools: ['Node.js', 'Express', 'MongoDB', 'Postman', 'Docker'],
    videoId: 'Oe421EPjeBE',
  },
  'database': {
    description:
      'Data is the backbone of every application. This course teaches relational and NoSQL databases from design to optimized queries, giving you the skills to architect data layers confidently.',
    whatYouWillLearn: [
      'Design normalized relational schemas',
      'Write complex SQL queries and stored procedures',
      'Work with MongoDB for document storage',
      'Optimize queries and understand indexing',
    ],
    requirements: [
      'Basic programming experience in any language',
    ],
    tools: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'DBeaver'],
    videoId: 'HXV3zeQKqGY',
  },
  'programming': {
    description:
      'Build a solid foundation in programming logic, data structures, and algorithms. Whether you\'re a beginner or sharpening fundamentals, this course gives you the problem-solving toolkit for any language.',
    whatYouWillLearn: [
      'Master variables, loops, functions, and OOP',
      'Solve problems with arrays, trees, and graphs',
      'Implement common sorting and search algorithms',
      'Analyze time and space complexity (Big O)',
    ],
    requirements: [
      'No prior experience required',
      'Curiosity and willingness to practice daily',
    ],
    tools: ['Python', 'JavaScript', 'LeetCode', 'VS Code'],
    videoId: 'rfscVS0vtbw',
  },
  'cyber security': {
    description:
      'Understand how attackers think and how defenders protect systems. This course covers ethical hacking, network security, and real-world CTF-style challenges to build practical security skills.',
    whatYouWillLearn: [
      'Understand common attack vectors (OWASP Top 10)',
      'Perform network scanning and reconnaissance',
      'Exploit and patch vulnerable systems ethically',
      'Set up firewalls, VPNs, and intrusion detection',
    ],
    requirements: [
      'Basic understanding of networking (TCP/IP)',
      'Familiarity with Linux command line',
    ],
    tools: ['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'Nmap'],
    videoId: 'hXSFdwIOfnE',
  },
  'design': {
    description:
      'Learn the principles behind great visual design and UI/UX. You\'ll work through color theory, typography, prototyping, and user research to create interfaces that users love.',
    whatYouWillLearn: [
      'Apply color theory, typography, and layout grids',
      'Design user flows and wireframes',
      'Build interactive prototypes',
      'Conduct usability testing and iterate',
    ],
    requirements: [
      'No prior design experience needed',
      'A creative mindset and attention to detail',
    ],
    tools: ['Figma', 'Adobe XD', 'Sketch', 'Zeplin', 'InVision'],
    videoId: 'c9Wg6Cb_YlU',
  },
};

const DEFAULT_FALLBACK: CourseFallback = {
  description:
    'This course takes you from the fundamentals to real-world projects, giving you the practical skills and confidence to excel in your chosen field.',
  whatYouWillLearn: [
    'Understand core concepts and theory',
    'Apply skills to hands-on projects',
    'Build a portfolio-ready final project',
    'Get job-ready with industry best practices',
  ],
  requirements: ['Internet connection and a computer', 'Enthusiasm to learn'],
  tools: ['VS Code', 'Git', 'GitHub'],
  videoId: 'ysEN5RaKOlA',
};

function fallbackFor(category: string | undefined): CourseFallback {
  const key = (category || '').toLowerCase().trim();
  return FALLBACKS[key] ?? DEFAULT_FALLBACK;
}

/* ================================================================
   Component
   ================================================================ */
@Component({
  selector: 'app-course-detail',
  standalone: true,
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.css',
})
export class CourseDetailComponent {
  private sanitizer = inject(DomSanitizer);

  /* ---- Course input ---- */
  private _courseSignal = signal<Course | null>(null);

  @Input() set course(value: Course | null) { this._courseSignal.set(value); }
  get course(): Course | null { return this._courseSignal(); }

  /* ---- Enrolled / enrolling sets passed in from parent ---- */
  @Input() enrolledIds    = signal<Set<string>>(new Set());
  @Input() enrollingIds   = signal<Set<string>>(new Set());
  @Input() unenrollingIds = signal<Set<string>>(new Set());

  @Output() close   = new EventEmitter<void>();
  @Output() enroll  = new EventEmitter<Course>();
  @Output() unenroll = new EventEmitter<Course>();

  /* ---- ESC key listener ---- */
  @HostListener('document:keydown.escape')
  onEsc() { if (this._courseSignal()) this.close.emit(); }

  /* ---- overlay click (only when clicking the backdrop) ---- */
  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('detail-overlay')) {
      this.close.emit();
    }
  }

  /* ---- template helper to get current course ---- */
  courseData = computed(() => this._courseSignal());

  /* ---- derived enrollment state ---- */
  isEnrolled = computed(() => {
    const c = this._courseSignal();
    return c ? this.enrolledIds().has(c._id) : false;
  });

  isEnrolling = computed(() => {
    const c = this._courseSignal();
    return c ? this.enrollingIds().has(c._id) : false;
  });

  isUnenrolling = computed(() => {
    const c = this._courseSignal();
    return c ? this.unenrollingIds().has(c._id) : false;
  });

  coverImgUrl = computed(() => uploadedFileUrl('courses', this._courseSignal()?.imageUrl));
  coverColors  = computed(() => categoryColors(this._courseSignal()?.category));

  coverIconSvgHtml = computed((): SafeHtml =>
    this.sanitizer.bypassSecurityTrustHtml(categoryIconSvg(this._courseSignal()?.category))
  );

  levelDotsList = computed(() => {
    const filled = levelFilledDots(this._courseSignal()?.level);
    return [0, 1, 2].map((i) => i < filled);
  });

  /* ---- rich content (backend fields with fallback) ---- */
  private fb = computed(() => fallbackFor(this._courseSignal()?.category));

  description       = computed(() => this._courseSignal()?.description ?? this.fb().description);
  whatYouWillLearn  = computed(() => this._courseSignal()?.whatYouWillLearn?.length ? this._courseSignal()!.whatYouWillLearn! : this.fb().whatYouWillLearn);
  requirements      = computed(() => this._courseSignal()?.requirements?.length     ? this._courseSignal()!.requirements!     : this.fb().requirements);
  tools             = computed(() => this._courseSignal()?.tools?.length             ? this._courseSignal()!.tools!             : this.fb().tools);

  videoEmbedUrl = computed((): SafeResourceUrl | null => {
    const c = this._courseSignal();
    if (!c) return null;
    let videoId = '';
    if (c.videoUrl) {
      const m = c.videoUrl.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      videoId = m ? m[1] : c.videoUrl.length === 11 ? c.videoUrl : '';
    }
    if (!videoId) videoId = this.fb().videoId;
    if (!videoId) return null;
    const url = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  /* ---- helpers ---- */
  capitalize = capitalizeWords;

  onEnroll() {
    const c = this._courseSignal();
    if (c) this.enroll.emit(c);
  }

  onUnenroll() {
    const c = this._courseSignal();
    if (c) this.unenroll.emit(c);
  }
}
