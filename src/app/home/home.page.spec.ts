import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { RestauranteService } from '../services/restaurante.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  // Mock del servicio para no tocar Firebase en los tests
  const restauranteServiceMock = {
    getAll: async () => [],
    add: async () => {},
    addAll: async () => {},
    delete: async () => {},
    deleteAll: async () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage, IonicModule.forRoot()],
      providers: [
        { provide: RestauranteService, useValue: restauranteServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});