
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from './app-error.handler';
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { EndpointFactory } from './services/endpoint-factory.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';
import { ModalService } from './services/modalservice';

import { ModalComponentDirective } from './directives/modal.component.directive';
import { GroupByPipe } from './pipes/group-by.pipe';

import { AppComponent } from './components/app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NotificationsViewerComponent } from './components/controls/notifications-viewer.component';
import { UserInfoComponent } from './components/controls/user-info.component';
import { UserPreferencesComponent } from './components/controls/user-preferences.component';
import { UsersManagementComponent } from './components/controls/users-management.component';
import { RolesManagementComponent } from './components/controls/roles-management.component';
import { ViewDefinitionComponent } from './components/controls/view-definition.component';
import { ProgramSettingComponent } from './components/controls/program-setting.component';
import { RoleEditorComponent } from './components/controls/role-editor.component';


import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';
import { LayoutModule,BoxModule  } from '../../node_modules/angular-admin-lte';
import { CoreModule } from './components/core/core.module';
import { adminLteConf } from './admin-lte.conf';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLanguageLoader
      }
    }),
    ,



    LayoutModule,LoadingPageModule, MaterialBarModule,NgbModule,CoreModule,BoxModule ,
    LayoutModule.forRoot(adminLteConf)
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SettingsComponent,
    UsersManagementComponent, UserInfoComponent, UserPreferencesComponent, ProgramSettingComponent,
    RolesManagementComponent, RoleEditorComponent, ViewDefinitionComponent,
    NotFoundComponent,
    NotificationsViewerComponent,
    ModalComponentDirective,
    GroupByPipe
  ],
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl },
    { provide: ErrorHandler, useClass: AppErrorHandler },

    ConfigurationService,
    AppTitleService,
    AppTranslationService,
    AccountService,
    AccountEndpoint,
    LocalStoreManager,
    EndpointFactory,
    ModalService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  bootstrap: [AppComponent]
})
export class AppModule {
}



export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}
