import { Pipe, PipeTransform } from '@angular/core';
import { UserForReturn } from 'src/data/DTOs/user';
import { AuthService } from 'src/services/auth.service';

@Pipe({
  name: 'isblocked',
})
export class IsblockedPipe implements PipeTransform {
  /**
   * Have you blocked current user
   * @param authService
   */
  constructor(private authService: AuthService) {}

  transform(value: UserForReturn): boolean {
    if (this.authService.currentUser?.blockedIds?.includes(`${value.id},`))
      return true;

    return false;
  }
}
