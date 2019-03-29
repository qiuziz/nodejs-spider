import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './container/login/login.component';
import { HomeComponent } from './container/home/home.component';
import { LikeComponent } from './container/like/like.component';
import { LookImageComponent } from './component/look-image/look-image.component';
import { FooterComponent } from './component/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { LoadingService } from './loading.service';
import { RoutesModule } from './routes.module';

/** 配置 angular i18n **/
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { environment } from '../environments/environment';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LookImageComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    LikeComponent
  ],
  imports: [
    BrowserModule,
    RoutesModule,
    HttpClientModule,
    NgZorroAntdModule,
    FormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: true })
  ],
  providers: [LoadingService, { provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
