import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/decorators/skip.auth.decorator';
import { BlockedBillsService } from './blocked.bills.service';

@Controller('blocked-bills')
export class BlockedBillsController {
  constructor(private readonly blockedBillsService: BlockedBillsService) {}

  @Public()
  @Get()
  findBlockedBills() {
    return this.blockedBillsService.getAcceptableDenominations();
  }
}
