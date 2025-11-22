import { Entity, Enum, ManyToOne, PrimaryKey, Property, SerializedPrimaryKey, OptionalProps } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { TODO_STATUSES, type TodoStatus } from "../../../types/todo";
import { User } from "./User";

@Entity({ collection: "todos" })
export class Todo {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'status' | 'tags';

  @PrimaryKey({ type: 'ObjectId' })
  _id: ObjectId = new ObjectId();

  @SerializedPrimaryKey()
  get id(): string {
    return this._id.toHexString();
  }

  @Property({ type: 'string' })
  title!: string;

  @Property({ type: 'string', nullable: true })
  description?: string;

  @Enum({ items: () => TODO_STATUSES, default: "PENDING" })
  status: TodoStatus = "PENDING";

  @Property({ type: 'date', nullable: true })
  dueDate?: Date;

  @Property({ type: "array", default: [] })
  tags: string[] = [];

  @ManyToOne(() => User)
  owner!: User;

  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date(), onCreate: () => new Date() })
  updatedAt: Date = new Date();
}
