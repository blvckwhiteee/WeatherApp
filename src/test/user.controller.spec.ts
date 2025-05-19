import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { UserInfo } from '../model/user.info';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    const mockService = {
        subscribe: jest.fn(),
        confirm: jest.fn(),
        unsubscribe: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [{ provide: UserService, useValue: mockService }],
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
    });

    it('should call service.subscribe', async () => {
        const dto: UserInfo = {
            email: 'test@example.com',
            city: 'Kyiv',
            frequency: 'daily',
            token: 'some-token',
        };

        const result = { message: 'ok' };
        mockService.subscribe.mockResolvedValue(result);

        expect(await controller.subscribe(dto)).toBe(result);
        expect(mockService.subscribe).toHaveBeenCalledWith(dto);
    });

    it('should confirm token', async () => {
        const token = 'some-token';
        mockService.confirm.mockResolvedValue({});
        const result = await controller.confirm(token);

        expect(mockService.confirm).toHaveBeenCalledWith(token);
        expect(result).toEqual({
            message: 'Subscription confirmed successfully',
        });
    });

    it('should unsubscribe token', async () => {
        const token = 'some-token';
        mockService.unsubscribe.mockResolvedValue({});
        const result = await controller.unsubscribe(token);

        expect(mockService.unsubscribe).toHaveBeenCalledWith(token);
        expect(result).toEqual({ message: 'Unsubscribed successfully' });
    });
});
