import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Appointments {
    @PrimaryGeneratedColumn()
    id!: number
    @Column()
    EnglishName!: string
    @Column()
    ChineseName!: string
    @Column()
    Gender!: string
    @Column()
    HkId!: string
    @Column()
    Brith!: Date
    @Column()
    BrithPlace!: string
    @Column()
    Address!: string
    @Column()
    VaccineBrand!: string
    @Column()
    AppointmentDate!: Date
    @Column()
    AppointmentPlace!: string
    @CreateDateColumn()
    created_at!: Date
    @UpdateDateColumn()
    updated_at!: Date
    @Column()
    Status!:string
}