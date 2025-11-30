import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransactionList } from './inventory-transaction-list';

describe('InventoryTransactionList', () => {
  let component: InventoryTransactionList;
  let fixture: ComponentFixture<InventoryTransactionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryTransactionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryTransactionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
