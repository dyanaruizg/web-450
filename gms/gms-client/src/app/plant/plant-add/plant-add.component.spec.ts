import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PlantAddComponent } from './plant-add.component';
import { PlantService } from '../plant.service';
import { GardenService } from '../../garden/garden.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AddPlantDTO, Plant } from '../plant';

describe('PlantAddComponent', () => {
  let component: PlantAddComponent;
  let fixture: ComponentFixture<PlantAddComponent>;
  let plantService: PlantService;
  let gardenService: GardenService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule, PlantAddComponent],
      providers: [
        PlantService,
        GardenService,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantAddComponent);
    component = fixture.componentInstance;
    plantService = TestBed.inject(PlantService);
    gardenService = TestBed.inject(GardenService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled correctly', () => {
    component.plantForm.controls['name'].setValue('Test Plant');
    component.plantForm.controls['type'].setValue('Flower');
    component.plantForm.controls['status'].setValue('Planted');
    component.plantForm.controls['gardenId'].setValue(1);
    component.plantForm.controls['datePlanted'].setValue('2023-01-01');
    expect(component.plantForm.valid).toBeTrue();
  });

  it('should call addPlant and navigate on successful form submission', () => {
    const addPlantDTO: AddPlantDTO = {
      name: 'Test Plant',
      type: 'Flower',
      status: 'Planted',
      datePlanted: '2023-04-15T00:00:00.000Z'
    };
    const mockPlant: Plant = {
      _id: '1',
      gardenId: 1,
      name: 'Test Plant',
      type: 'Flower',
      status: 'Planted',
      datePlanted: '2023-04-15T00:00:00.000Z',
      dateHarvested: undefined,
      dateCreated: '2023-04-15T00:00:00.000Z',
      dateModified: undefined
    };

    spyOn(plantService, 'addPlant').and.returnValue(of(mockPlant));
    spyOn(router, 'navigate');

    component.plantForm.controls['name'].setValue(addPlantDTO.name);
    component.plantForm.controls['type'].setValue(addPlantDTO.type);
    component.plantForm.controls['status'].setValue(addPlantDTO.status);
    component.plantForm.controls['gardenId'].setValue(1);
    component.plantForm.controls['datePlanted'].setValue('2023-04-15T00:00:00.000Z');

    component.onSubmit();

    expect(plantService.addPlant).toHaveBeenCalledWith(1, addPlantDTO);
    expect(router.navigate).toHaveBeenCalledWith(['/plants']);
  });

  it('should handle error on form submission failure', () => {
    spyOn(plantService, 'addPlant').and.returnValue(throwError('Error creating plant'));
    spyOn(console, 'error');

    component.plantForm.controls['name'].setValue('Test Plant');
    component.plantForm.controls['type'].setValue('Flower');
    component.plantForm.controls['status'].setValue('Planted');
    component.plantForm.controls['gardenId'].setValue(1);
    component.plantForm.controls['datePlanted'].setValue('2023-04-15T00:00:00.000Z');

    component.onSubmit();

    expect(plantService.addPlant).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error creating plant', 'Error creating plant');
  });
});
