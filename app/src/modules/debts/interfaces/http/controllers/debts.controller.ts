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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../auth/infrastructure/security/guards/JwtAuthGuard';
import { CreateDebtUseCase } from '../../../application/use-cases/CreateDebt.usecase';
import { RegisterDebtPaymentUseCase } from '../../../application/use-cases/RegisterDebtPayment.usecase';
import { GetDebtDetailUseCase } from '../../../application/use-cases/GetDebtDetail.usecase';
import { ListDebtsUseCase } from '../../../application/use-cases/ListDebts.usecase';
import { ArchiveDebtUseCase } from '../../../application/use-cases/ArchiveDebt.usecase';
import { UpdateDebtUseCase } from '../../../application/use-cases/UpdateDebt.usecase';
import { UnarchiveDebtUseCase } from '../../../application/use-cases/UnarchiveDebt.usecase';
import { CreateDebtCommand } from '../../../application/commands/CreateDebtCommand';
import { UpdateDebtCommand } from '../../../application/commands/UpdateDebtCommand';
import { RegisterDebtPaymentCommand } from '../../../application/commands/RegisterDebtPaymentCommand';
import { CreateDebtRequestDto } from '../dto/request/CreateDebtRequest.dto';
import { UpdateDebtRequestDto } from '../dto/request/UpdateDebtRequest.dto';
import { RegisterDebtPaymentRequestDto } from '../dto/request/RegisterDebtPaymentRequest.dto';
import { ListDebtsQueryDto } from '../dto/request/ListDebtsQuery.dto';

@ApiTags('debts')
@ApiBearerAuth('JWT-auth')
@Controller('debts')
@UseGuards(JwtAuthGuard)
export class DebtsController {
  constructor(
    private readonly createDebtUseCase: CreateDebtUseCase,
    private readonly registerDebtPaymentUseCase: RegisterDebtPaymentUseCase,
    private readonly getDebtDetailUseCase: GetDebtDetailUseCase,
    private readonly listDebtsUseCase: ListDebtsUseCase,
    private readonly archiveDebtUseCase: ArchiveDebtUseCase,
    private readonly updateDebtUseCase: UpdateDebtUseCase,
    private readonly unarchiveDebtUseCase: UnarchiveDebtUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear deuda', description: 'Crea una nueva deuda para el usuario autenticado.' })
  @ApiResponse({ status: 201, description: 'Deuda creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createDebt(@Body() body: CreateDebtRequestDto, @Request() req: any) {
    const command = new CreateDebtCommand(body.accountId, body.description, body.amount, body.date);
    const debt = await this.createDebtUseCase.execute(command, req.user.id);

    return {
      message: 'Deuda creada exitosamente',
      data: debt.toPrimitives(),
    };
  }

  @Post(':id/payments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar pago', description: 'Registra un pago a una deuda existente.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la deuda' })
  @ApiResponse({ status: 201, description: 'Pago registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o monto excede saldo' })
  @ApiResponse({ status: 404, description: 'Deuda no encontrada' })
  async registerPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RegisterDebtPaymentRequestDto,
    @Request() req: any,
  ) {
    const command = new RegisterDebtPaymentCommand(id, body.amount, body.date);
    const payment = await this.registerDebtPaymentUseCase.execute(command, req.user.id);

    return {
      message: 'Pago registrado exitosamente',
      data: payment.toPrimitives(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar deudas', description: 'Lista las deudas del usuario con filtros opcionales.' })
  @ApiResponse({ status: 200, description: 'Lista de deudas' })
  async listDebts(@Query() query: ListDebtsQueryDto, @Request() req: any) {
    const result = await this.listDebtsUseCase.execute(req.user.id, {
      accountId: query.accountId,
      status: query.status,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      page: query.page,
      perPage: query.perPage,
      includeArchived: query.includeArchived === 'true',
    });

    return {
      message: 'Deudas obtenidas exitosamente',
      data: result.items.map((d) => d.toPrimitives()),
      total: result.total,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de deuda', description: 'Obtiene el detalle de una deuda con sus pagos.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la deuda' })
  @ApiResponse({ status: 200, description: 'Detalle de deuda' })
  @ApiResponse({ status: 404, description: 'Deuda no encontrada' })
  async getDebtDetail(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const result = await this.getDebtDetailUseCase.execute(id, req.user.id);

    return {
      message: 'Deuda obtenida exitosamente',
      data: {
        ...result.debt.toPrimitives(),
        payments: result.payments.map((p) => p.toPrimitives()),
      },
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar deuda', description: 'Edita la descripción y/o fecha de una deuda.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la deuda' })
  @ApiResponse({ status: 200, description: 'Deuda actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Deuda no encontrada' })
  async updateDebt(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDebtRequestDto,
    @Request() req: any,
  ) {
    const command = new UpdateDebtCommand(body.description, body.date);
    const debt = await this.updateDebtUseCase.execute(id, command, req.user.id);

    return {
      message: 'Deuda actualizada exitosamente',
      data: debt.toPrimitives(),
    };
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archivar deuda', description: 'Archiva una deuda pagada (eliminación lógica).' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la deuda' })
  @ApiResponse({ status: 200, description: 'Deuda archivada' })
  @ApiResponse({ status: 409, description: 'Deuda no está pagada' })
  async archiveDebt(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const debt = await this.archiveDebtUseCase.execute(id, req.user.id);

    return {
      message: 'Deuda archivada exitosamente',
      data: debt.toPrimitives(),
    };
  }

  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Desarchivar deuda', description: 'Desarchiva una deuda.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la deuda' })
  @ApiResponse({ status: 200, description: 'Deuda desarchivada' })
  @ApiResponse({ status: 404, description: 'Deuda no encontrada' })
  async unarchiveDebt(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const debt = await this.unarchiveDebtUseCase.execute(id, req.user.id);

    return {
      message: 'Deuda desarchivada exitosamente',
      data: debt.toPrimitives(),
    };
  }
}
