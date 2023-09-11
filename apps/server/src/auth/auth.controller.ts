import { Controller, Get, Req, Res, UseFilters } from '@nestjs/common';

/* Services */
import { AuthRedirect } from '@/helper/auth-redirect.service';
import { AuthException } from '@/exceptions/auth-exception.service';
import { AuthService } from '@/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authRedirect: AuthRedirect,
    private authService: AuthService,
  ) {}

  @Get()
  @UseFilters(AuthException)
  async authMiddleware(@Req() req, @Res() res) {
    return this.authRedirect.redirect(req, res);
  }

  @Get('/offline')
  async authOffline(@Req() req, @Res() res) {
    return this.authService.storeOfflineToken(req, res);
  }

  @Get('/online')
  async authOnline(@Req() req, @Res() res) {
    const shop = await this.authService.storeOnlineToken(req, res);
    res.status(200).redirect(`/?shop=${shop}&host=${req.query.host}`);
  }
}
