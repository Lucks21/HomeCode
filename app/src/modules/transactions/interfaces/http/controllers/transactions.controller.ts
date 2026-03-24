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
import { CreateTransactionUseCase } from '../../../application/use-cases/CreateTransaction.usecase';
import { UpdateTransactionUseCase } from '../../../application/use-cases/UpdateTransaction.usecase';
import { ArchiveTransactionUseCase } from '../../../application/use-cases/ArchiveTransaction.usecase';
import { ListTransactionsUseCase } from '../../../application/use-cases/ListTransactions.usecase';
import { CreateTransactionCommand } from '../../../application/commands/CreateTransactionCommand';
import { UpdateTransactionCommand } from '../../../application/commands/UpdateTransactionCommand';
import { CreateTransactionRequestDto } from '../dto/request/CreateTransactionRequest.dto';
import { UpdateTransactionRequestDto } from '../dto/request/UpdateTransactionRequest.dto';
import { ListTransactionsQueryDto } from '../dto/request/ListTransactionsQuery.dto';

@ApiTags('transactions')
@ApiBearerAuth('JWT-auth')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly archiveTransactionUseCase: ArchiveTransactionUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear movimiento', description: 'Crea un nuevo movimiento en una cuenta tipo MAIN.' })
  @ApiResponse({ status: 201, description: 'Movimiento creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Cuenta no encontrada' })
  async createTransaction(@Body() body: CreateTransactionRequestDto, @Request() req: any) {
    const command = new CreateTransactionCommand(
      body.accountId,
      body.description,
      body.amount,
      body.type,
      new Date(body.date),
    );
    const transaction = await this.createTransactionUseCase.execute(command, req.user.id);

    return {
      message: 'Movimiento creado exitosamente',
      data: transaction.toPrimitives(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar movimientos', description: 'Lista los movimientos del usuario con filtros opcionales.' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos' })
  async listTransactions(@Query() query: ListTransactionsQueryDto, @Request() req: any) {
    const filters = {
      accountId: query.accountId ? parseInt(query.accountId) : undefined,
      type: query.type,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
      page: query.page ? parseInt(query.page) : undefined,
      perPage: query.perPage ? parseInt(query.perPage) : undefined,
    };

    const result = await this.listTransactionsUseCase.execute(req.user.id, filters);

    return {
      message: 'Movimientos obtenidos exitosamente',
      data: result.items.map((t) => t.toPrimitives()),
      meta: {
        total: result.total,
        page: result.page,
        perPage: result.perPage,
      },
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar movimiento', description: 'Modifica los datos de un movimiento existente.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del movimiento' })
  @ApiResponse({ status: 200, description: 'Movimiento actualizado' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  async updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTransactionRequestDto,
    @Request() req: any,
  ) {
    const command = new UpdateTransactionCommand(
      body.description,
      body.amount,
      body.type,
      body.date ? new Date(body.date) : undefined,
    );
    const transaction = await this.updateTransactionUseCase.execute(id, command, req.user.id);

    return {
      message: 'Movimiento actualizado exitosamente',
      data: transaction.toPrimitives(),
    };
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archivar movimiento', description: 'Archiva un movimiento (eliminación lógica).' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del movimiento' })
  @ApiResponse({ status: 200, description: 'Movimiento archivado' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  async archiveTransaction(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const transaction = await this.archiveTransactionUseCase.execute(id, req.user.id);

    return {
      message: 'Movimiento archivado exitosamente',
      data: transaction.toPrimitives(),
    };
  }
}
