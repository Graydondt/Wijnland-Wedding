import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { mainRoutes } from 'src/routes/main.routes';

@NgModule({
	imports: [ RouterModule.forRoot(mainRoutes, { useHash: true }) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
