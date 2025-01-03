import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity()
@Unique(["id", "guildId"])
export class UserEntity {
  @PrimaryColumn({ type: "text" })
  id: string;

  @PrimaryColumn({ type: "text" })
  guildId: string;

  @Column({ type: "int", default: 0 })
  messages: number;
}
