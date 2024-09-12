import { SaleProduct } from './sale-product.entity';
import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { ProductSet } from './product-set.entity';

export const TableName = 'products';

@Entity(TableName)
export class Product {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  kana: string;

  @Column()
  sizename: string;

  @Column()
  unit: string;

  @Column()
  jancode: string;

  @Column()
  category: string;

  @ManyToOne(() => ProductCategory, (product_category) => product_category.id)
  @JoinColumn({ name: 'category', referencedColumnName: 'id' })
  product_category: ProductCategory;

  @Column()
  type1: string;

  @ManyToOne(() => ProductCategory, (product_type1) => product_type1.id)
  @JoinColumn({ name: 'type1', referencedColumnName: 'id' })
  product_type1: ProductCategory;

  @Column()
  type2: string;

  @ManyToOne(() => ProductCategory, (product_type2) => product_type2.id)
  @JoinColumn({ name: 'type2', referencedColumnName: 'id' })
  product_type2: ProductCategory;

  @Column()
  type3: string;

  @ManyToOne(() => ProductCategory, (product_type3) => product_type3.id)
  @JoinColumn({ name: 'type3', referencedColumnName: 'id' })
  product_type3: ProductCategory;

  @Column()
  type4: string;

  @ManyToOne(() => ProductCategory, (product_type4) => product_type4.id)
  @JoinColumn({ name: 'type4', referencedColumnName: 'id' })
  product_type4: ProductCategory;

  @Column()
  type5: string;

  @ManyToOne(() => ProductCategory, (product_type5) => product_type5.id)
  @JoinColumn({ name: 'type5', referencedColumnName: 'id' })
  product_type5: ProductCategory;

  @Column()
  stockctrl: number;

  @Column()
  taxtype: number;

  @Column()
  tax: number;

  @Column()
  unitprice: number;

  @Column()
  unitcost: number;

  @Column()
  cycle: number;

  @Column()
  is_disabled: number;

  @Column()
  print_name: string;

  @Column()
  correct_amount: number;

  @Column()
  short_name: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => SaleProduct, (saleProduct) => saleProduct.product)
  @JoinColumn({ name: 'id' })
  saleProduct: SaleProduct;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToMany(() => ProductSet, (productSet) => productSet.products)
  productSet: ProductSet[];

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
