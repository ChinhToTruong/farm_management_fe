import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDiaryDetail } from './work-diary-detail';

describe('WorkDiaryDetail', () => {
  let component: WorkDiaryDetail;
  let fixture: ComponentFixture<WorkDiaryDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkDiaryDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkDiaryDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
