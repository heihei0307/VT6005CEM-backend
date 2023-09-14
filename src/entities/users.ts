import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id!: number
    @Column()
    username!: string
    @Column()
    password!: string
    @Column()
    password_salt!: string
    @Column()
    email!: string
    @Column()
    type!: string
    @Column({nullable: true})
    nickname!: string
    @CreateDateColumn()
    created_at!: Date
    @UpdateDateColumn()
    updated_at!: Date
    @Column({nullable: true})
    last_login!: Date
    @Column({nullable: true})
    code!: string
    @Column({nullable: true})
    code_verify_date!: Date
}

export class EditUserRequest{
    id!: number
    type!: string
    nickname!: string
}