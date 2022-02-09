import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) { }

    // createEstimate(estimateDto: GetEstimateDto){
    //     return this.repo.createQueryBuilder().select('*')
    //     .where('make =: make', {make: estimateDto.make})
    //     .getRawMany();
    // }

    createEstimate({make, model, lng, ltd, year, mileage}: GetEstimateDto){
        return this.repo.createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('make =: make', {make})
        .andWhere('model =: model', {model})
        .andWhere('lng -: lng BETWEEN -5 AND 5', {lng})
        .andWhere('ltd -: ltd BETWEEN -5 AND 5', {ltd})
        .andWhere('year -: year BETWEEN -3 AND 3', {year})
        .andWhere('approved IS TRUE')
        .orderBy('ABS(mileage -: mileage)', 'DESC')
        .setParameters({mileage})
        .limit(3)
        .getRawOne();
    }
    
    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto)
        report.user = user;
        return this.repo.save(report);
    }

    async changeApproval(id: string, approved: boolean){
        const report = await this.repo.findOne(id);
        if(!report){
            throw new NotFoundException('Report not found');
        }
        report.approved = approved;
        return this.repo.save(report);
    }
}
