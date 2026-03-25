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
import { CreateInstallmentUseCase } from '../../../application/use-cases/CreateInstallment.usecase';
import { PayInstallmentsUseCase } from '../../../application/use-cases/PayInstallments.usecase';
import { GetInstallmentDetailUseCase } from '../../../application/use-cases/GetInstallmentDetail.usecase';
import { ListInstallmentsUseCase } from '../../../application/use-cases/ListInstallments.usecase';
import { ArchiveInstallmentUseCase } from '../../../application/use-cases/ArchiveInstallment.usecase';
import { CreateInstallmentCommand } from '../../../application/commands/CreateInstallmentCommand';
import { PayInstallmentsCommand } from '../../../application/commands/PayInstallmentsCommand';
import { CreateInstallmentRequestDto } from '../dto/request/CreateInstallmentRequest.dto';
import { PayInstallmentsRequestDto } from '../dto/request/PayInstallmentsRequest.dto';
import { ListInstallmentsQueryDto } from '../dto/request/ListInstallmentsQuery.dto';

@ApiTags('installments')
@ApiBearerAuth('JWT-auth')
@Controller('installments')
@UseGuards(JwtAuthGuard)
export class InstallmentsController {
  constructor(
    private readonly createInstallmentUseCase: CreateInstallmentUseCase,
    private readonly payInstallmentsUseCase: PayInstallmentsUseCase,
    private readonly getInstallmentDetailUseCase: GetInstallmentDetailUseCase,
    private readonly listInstallmentsUseCase: ListInstallmentsUseCase,
    private readonly archiveInstallmentUseCase: ArchiveInstallmentUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear plan de cuotas', description: 'Crea un nuevo plan de cuotas con pagos auto-generados.' })
  @ApiResponse({ status: 201, description: 'Plan de cuotas creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createInstallment(@Body() body: CreateInstallmentRequestDto, @Request() req: any) {
    const command = new CreateInstallmentCommand(
      body.accountId,
      body.description,
      body.totalAmount,
      body.totalInstallments,
      body.installmentValue,
      body.startDate,
    );
    const installment = await this.createInstallmentUseCase.execute(command, req.user.id);

    return {
      message: 'Plan de cuotas creado exitosamente',
      data: installment.toPrimitives(),
    };
  }

  @Post(':id/pay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pagar cuotas', description: 'Paga las próximas N cuotas pendientes del plan.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del plan de cuotas' })
  @ApiResponse({ status: 200, description: 'Cuotas pagadas exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o demasiadas cuotas' })
  @ApiResponse({ status: 404, description: 'Plan de cuotas no encontrado' })
  async payInstallments(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PayInstallmentsRequestDto,
    @Request() req: any,
  ) {
    const command = new PayInstallmentsCommand(id, body.count);
    const installment = await this.payInstallmentsUseCase.execute(command, req.user.id);

    return {
      message: 'Cuotas pagadas exitosamente',
      data: installment.toPrimitives(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar planes de cuotas', description: 'Lista los planes de cuotas del usuario con paginación.' })
  @ApiResponse({ status: 200, description: 'Lista de planes de cuotas' })
  async listInstallments(@Query() query: ListInstallmentsQueryDto, @Request() req: any) {
    const filters = {
      page: query.page ? parseInt(query.page) : undefined,
      perPage: query.perPage ? parseInt(query.perPage) : undefined,
    };

    const result = await this.listInstallmentsUseCase.execute(req.user.id, filters);

    return {
      message: 'Planes de cuotas obtenidos exitosamente',
      data: result.items.map((i) => i.toPrimitives()),
      total: result.total,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de plan de cuotas', description: 'Obtiene el detalle de un plan con todos sus pagos y progreso.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del plan de cuotas' })
  @ApiResponse({ status: 200, description: 'Detalle del plan de cuotas' })
  @ApiResponse({ status: 404, description: 'Plan de cuotas no encontrado' })
  async getInstallmentDetail(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const installment = await this.getInstallmentDetailUseCase.execute(id, req.user.id);

    return {
      message: 'Plan de cuotas obtenido exitosamente',
      data: installment.toPrimitives(),
    };
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archivar plan de cuotas', description: 'Archiva un plan de cuotas completamente pagado.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del plan de cuotas' })
  @ApiResponse({ status: 200, description: 'Plan de cuotas archivado' })
  @ApiResponse({ status: 409, description: 'El plan no está completamente pagado' })
  async archiveInstallment(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const installment = await this.archiveInstallmentUseCase.execute(id, req.user.id);

    return {
      message: 'Plan de cuotas archivado exitosamente',
      data: installment.toPrimitives(),
    };
  }
}
