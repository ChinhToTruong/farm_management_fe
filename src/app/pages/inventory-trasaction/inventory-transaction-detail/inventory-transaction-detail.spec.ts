import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransactionDetail } from './inventory-transaction-detail';

describe('InventoryTransactionDetail', () => {
  let component: InventoryTransactionDetail;
  let fixture: ComponentFixture<InventoryTransactionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryTransactionDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryTransactionDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
