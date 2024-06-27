import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';
@Table({ modelName: 'token', tableName: 'token_db', timestamps: false })
export class token_db extends Model {
  @PrimaryKey
  @Column({ allowNull: true, type: DataType.BIGINT.UNSIGNED, field: 'stardust_tokenId' })
  stardust_tokenId!: Number;

  @PrimaryKey
  @Column({ allowNull: false, type: DataType.INTEGER(), field: 'templateId' })
  templateId!: string;

  @Column({ allowNull: false, type: DataType.INTEGER(), field: 'amount' })
  amount!: string;

  @Column({ allowNull: false, type: DataType.CHAR(36), field: 'playerId' })
  playerId!: Number;

  @Column({ allowNull: true, type: DataType.STRING(), field: 'name' })
  name!: string;

  @Column({ allowNull: true, type: DataType.JSON, field: 'props' })
  props!: string;

  @Column({ allowNull: false, type: DataType.BIGINT.UNSIGNED, field: 'blockchain_tokenId' })
  blockchain_tokenId!: Number;

}