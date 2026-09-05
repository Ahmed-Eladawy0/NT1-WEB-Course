import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRowComponent} from './course-row';

describe('CourseRow', () => {
  let component: CourseRowComponent;
  let fixture: ComponentFixture<CourseRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseRowComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
