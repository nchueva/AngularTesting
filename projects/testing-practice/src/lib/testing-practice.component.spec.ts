import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingPracticeComponent } from './testing-practice.component';

describe('TestingPracticeComponent', () => {
  let component: TestingPracticeComponent;
  let fixture: ComponentFixture<TestingPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingPracticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestingPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
