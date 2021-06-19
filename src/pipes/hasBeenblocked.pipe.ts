import { Pipe, PipeTransform } from '@angular/core';
import { UserForReturn } from 'src/data/DTOs/user';
import { AuthService } from 'src/services/auth.service';

@Pipe({
  name: 'hasbeenblocked',
})
export class HasBeenBlockedPipe implements PipeTransform {
  /**
   * Have you blocked current user
   * @param authService
   */
  constructor(private authService: AuthService) {}

  transform(value: UserForReturn): boolean {
    if (value.blockedIds.includes(`${this.authService?.currentUser?.id},`))
      return true;

    return false;
  }
}
