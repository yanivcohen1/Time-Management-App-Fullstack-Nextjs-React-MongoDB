import { Entity, ManyToOne, PrimaryKey, Property, SerializedPrimaryKey, Unique, OptionalProps } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { User } from "./User";

@Entity({ collection: "refresh_tokens" })
export class RefreshToken {
  [OptionalProps]?: 'createdAt';

  @PrimaryKey({ type: 'ObjectId' })
  _id: ObjectId = new ObjectId();

  @SerializedPrimaryKey()
  get id(): string {
    return this._id.toHexString();
  }

  @Property({ type: 'string' })
  @Unique()
  token!: string;

  @ManyToOne(() => User)
  user!: User;

  @Property({ type: 'date' })
  expiresAt!: Date;

  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt: Date = new Date();
}
