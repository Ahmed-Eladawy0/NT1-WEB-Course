import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-team-manager',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './team-manager.html',
  styleUrl: './team-manager.css'
})
export class TeamManagerComponent {
  viewMode: 'card' | 'list' = 'card';
  departments = ['Development', 'Marketing', 'Design'];
  selectedDept = 'All';

  newMember = {
    name: '',
    age: null as number | null,
    department: this.departments[0],
    isAvailable: true
  };

  team = [
    { name: 'Esraa', age: 24, department: 'Development', isAvailable: true },
    { name: 'Ahmed', age: 29, department: 'Marketing', isAvailable: false },
    { name: 'Laila', age: 31, department: 'Design', isAvailable: true }
  ];

  formError = false;

  addMember() {
    if (this.newMember.name.trim() && this.newMember.age && this.newMember.department) {
      this.team.push({ 
        name: this.newMember.name, 
        age: this.newMember.age, 
        department: this.newMember.department, 
        isAvailable: this.newMember.isAvailable 
      });
      
      this.newMember = { name: '', age: null, department: this.departments[0], isAvailable: true };
      this.formError = false;
    } else {
      this.formError = true; 
    }
  }

  toggleAvailability(member: any) {
    member.isAvailable = !member.isAvailable;
  }

  hasMatchingMembers(): boolean {
    if (this.selectedDept === 'All') return true;
    return this.team.some(m => m.department === this.selectedDept);
  }
}