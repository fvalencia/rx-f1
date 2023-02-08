import { LayoutComponent } from '@core/components';
import { render} from '@testing-library/angular';
import { ToolbarComponent } from '@core/components/toolbar/toolbar.component';

import { AppMaterialModule } from './app-material.module';
import { AppComponent } from './app.component';

test('AppComponent should render', async () => {
  await render(AppComponent, {
    declarations: [LayoutComponent, ToolbarComponent],
    imports: [AppMaterialModule],
  });
});
