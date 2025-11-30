import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationDetail } from './vaccination-detail';

describe('VaccinationDetail', () => {
  let component: VaccinationDetail;
  let fixture: ComponentFixture<VaccinationDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaccinationDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaccinationDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
