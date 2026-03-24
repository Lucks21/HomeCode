import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../auth/infrastructure/security/guards/JwtAuthGuard';
import { CreateAccountUseCase } from '../../../application/use-cases/CreateAccount.usecase';
import { UpdateAccountUseCase } from '../../../application/use-cases/UpdateAccount.usecase';
import { ArchiveAccountUseCase } from '../../../application/use-cases/ArchiveAccount.usecase';
import { ListAccountsUseCase } from '../../../application/use-cases/ListAccounts.usecase';
import { GetAccountDetailUseCase } from '../../../application/use-cases/GetAccountDetail.usecase';
import { GetAccountSummaryUseCase } from '../../../application/use-cases/GetAccountSummary.usecase';
import { GetMonthlySummaryUseCase } from '../../../application/use-cases/GetMonthlySummary.usecase';
import { CreateAccountCommand } from '../../../application/commands/CreateAccountCommand';
import { UpdateAccountCommand } from '../../../application/commands/UpdateAccountCommand';
import { CreateAccountRequestDto } from '../dto/request/CreateAccountRequest.dto';
import { UpdateAccountRequestDto } from '../dto/request/UpdateAccountRequest.dto';
import { ListAccountsQueryDto } from '../dto/request/ListAccountsQuery.dto';

@ApiTags('accounts')
@ApiBearerAuth('JWT-auth')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly archiveAccountUseCase: ArchiveAccountUseCase,
    private readonly listAccountsUseCase: ListAccountsUseCase,
    private readonly getAccountDetailUseCase: GetAccountDetailUseCase,
    private readonly getAccountSummaryUseCase: GetAccountSummaryUseCase,
    private readonly getMonthlySummaryUseCase: GetMonthlySummaryUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear cuenta', description: 'Crea una nueva cuenta para el usuario autenticado.' })
  @ApiResponse({ status: 201, description: 'Cuenta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createAccount(@Body() body: CreateAccountRequestDto, @Request() req: any) {
    const command = new CreateAccountCommand(body.name, body.type, body.parentId);
    const account = await this.createAccountUseCase.execute(command, req.user.id);

    return {
      message: 'Cuenta creada exitosamente',
      data: account.toPrimitives(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar cuentas', description: 'Lista las cuentas del usuario en estructura jerárquica.' })
  @ApiQuery({ name: 'includeArchived', required: false, type: String, example: 'false' })
  @ApiResponse({ status: 200, description: 'Lista de cuentas' })
  async listAccounts(@Query() query: ListAccountsQueryDto, @Request() req: any) {
    const includeArchived = query.includeArchived === 'true';
    const accounts = await this.listAccountsUseCase.execute(req.user.id, includeArchived);

    const accountMap = new Map<number, any>();
    const roots: any[] = [];

    for (const account of accounts) {
      accountMap.set(account.id, { ...account.toPrimitives(), children: [] });
    }

    for (const account of accounts) {
      const node = accountMap.get(account.id);
      if (account.parentId && accountMap.has(account.parentId)) {
        accountMap.get(account.parentId).children.push(node);
      } else {
        roots.push(node);
      }
    }

    return {
      message: 'Cuentas obtenidas exitosamente',
      data: roots,
    };
  }

  @Get('summary/monthly')
  @ApiOperation({ summary: 'Resumen mensual', description: 'Obtiene el resumen financiero mensual del usuario.' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen mensual' })
  async getMonthlySummary(
    @Query('year') year: string,
    @Query('month') month: string,
    @Request() req: any,
  ) {
    const result = await this.getMonthlySummaryUseCase.execute(
      req.user.id,
      parseInt(year),
      parseInt(month),
    );

    return {
      message: 'Resumen mensual obtenido exitosamente',
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de cuenta', description: 'Obtiene el detalle de una cuenta con saldo calculado.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la cuenta' })
  @ApiResponse({ status: 200, description: 'Detalle de cuenta' })
  @ApiResponse({ status: 404, description: 'Cuenta no encontrada' })
  async getAccountDetail(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const result = await this.getAccountDetailUseCase.execute(id, req.user.id);

    return {
      message: 'Cuenta obtenida exitosamente',
      data: {
        ...result.account.toPrimitives(),
        children: result.children.map((c) => c.toPrimitives()),
        summary: result.summary,
      },
    };
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Resumen de cuenta', description: 'Obtiene el resumen financiero de una cuenta.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la cuenta' })
  @ApiResponse({ status: 200, description: 'Resumen de cuenta' })
  async getAccountSummary(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const result = await this.getAccountSummaryUseCase.execute(id, req.user.id);

    return {
      message: 'Resumen obtenido exitosamente',
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar cuenta', description: 'Modifica los datos de una cuenta existente.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la cuenta' })
  @ApiResponse({ status: 200, description: 'Cuenta actualizada' })
  @ApiResponse({ status: 404, description: 'Cuenta no encontrada' })
  async updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAccountRequestDto,
    @Request() req: any,
  ) {
    const command = new UpdateAccountCommand(body.name, body.parentId);
    const account = await this.updateAccountUseCase.execute(id, command, req.user.id);

    return {
      message: 'Cuenta actualizada exitosamente',
      data: account.toPrimitives(),
    };
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archivar cuenta', description: 'Archiva una cuenta (eliminación lógica).' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la cuenta' })
  @ApiResponse({ status: 200, description: 'Cuenta archivada' })
  @ApiResponse({ status: 409, description: 'Tiene datos activos' })
  async archiveAccount(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const account = await this.archiveAccountUseCase.execute(id, req.user.id);

    return {
      message: 'Cuenta archivada exitosamente',
      data: account.toPrimitives(),
    };
  }
}
