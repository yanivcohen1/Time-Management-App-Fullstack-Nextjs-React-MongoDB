import { Entity, PrimaryKey, Property, SerializedPrimaryKey, Unique, OptionalProps } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import type { UserRole } from "@/types/auth";

@Entity({ collection: "users" })
export class User {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'role';

  @PrimaryKey({ type: 'ObjectId' })
  _id: ObjectId = new ObjectId();

  @SerializedPrimaryKey()
  get id(): string {
    return this._id.toHexString();
  }

  @Property({ type: 'string' })
  @Unique()
  email!: string;

  @Property({ type: 'string' })
  password!: string;

  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'string', default: "user" })
  role: UserRole = "user";

  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date(), onCreate: () => new Date() })
  updatedAt: Date = new Date();
}
