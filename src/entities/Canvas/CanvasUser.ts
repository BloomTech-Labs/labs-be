import { Entity, Column, PrimaryColumn } from "typeorm";

export interface ICanvasUser {
  id: number;
  name: string;
  created_at: string;
  sortable_name: string;
  short_name: string;
  sis_user_id: string;
  integration_id: string | null;
  login_id: string;
  email: string;
}

@Entity({
  name: "canvas_students",
})
class CanvasStudent {
  @PrimaryColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  sortable_name: string;
  @Column()
  created_at: string;
  @Column()
  short_name: string;
  @Column()
  sis_user_id: string;
  @Column({ type: "varchar", nullable: true })
  integration_id: string | null;
  @Column()
  login_id: string;
}

export default CanvasStudent;
