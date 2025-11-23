import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDiaryList } from './work-diary-list';

describe('WorkDiaryList', () => {
  let component: WorkDiaryList;
  let fixture: ComponentFixture<WorkDiaryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkDiaryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkDiaryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
