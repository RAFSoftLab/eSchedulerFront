import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardUsersComponent } from './standard-users.component';

describe('StandardUsersComponent', () => {
  let component: StandardUsersComponent;
  let fixture: ComponentFixture<StandardUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
