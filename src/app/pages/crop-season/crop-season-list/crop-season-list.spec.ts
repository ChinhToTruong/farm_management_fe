import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropSeasonList } from './crop-season-list';

describe('CropSeasonList', () => {
  let component: CropSeasonList;
  let fixture: ComponentFixture<CropSeasonList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropSeasonList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropSeasonList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
