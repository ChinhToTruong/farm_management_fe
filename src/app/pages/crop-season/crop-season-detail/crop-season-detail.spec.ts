import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropSeasonDetail } from './crop-season-detail';

describe('CropSeasonDetail', () => {
  let component: CropSeasonDetail;
  let fixture: ComponentFixture<CropSeasonDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropSeasonDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropSeasonDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
