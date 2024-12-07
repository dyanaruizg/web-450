import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantService } from '../plant.service';
import { PlantListComponent } from './plant-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Plant } from '../plant';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

describe('PlantListComponent', () => {
  let component: PlantListComponent;
  let fixture: ComponentFixture<PlantListComponent>;
  let plantService: PlantService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, PlantListComponent], // Import PlantListComponent
      providers: [PlantService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantListComponent);
    component = fixture.componentInstance;
    plantService = TestBed.inject(PlantService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display records in the DOM', () => {
    const mockPlants: Plant[] = [
      { _id: '1', gardenId: 1, name: 'Rose', type: 'Flower', status: 'Planted', datePlanted: '2023-01-01' },
      { _id: '2', gardenId: 1, name: 'Tulip', type: 'Flower', status: 'Planted', datePlanted: '2023-01-02' }
    ];

    component.plants = mockPlants;
    fixture.detectChanges(); // Trigger change detection

    const plantRows = fixture.debugElement.queryAll(By.css('.plant-page__table-body .plant-page__table-row'));
    expect(plantRows.length).toBeGreaterThan(0); // Check that there are plant rows in the DOM
  });

  it('should handle error when fetching plants', () => {
    spyOn(plantService, 'getPlants').and.returnValue(throwError('Error fetching plants'));

    fixture.detectChanges(); // Trigger the component's constructor

    expect(component.plants.length).toBe(0);
  });

  it('should delete a plant', () => {
    const mockPlants: Plant[] = [
      { _id: '1', gardenId: 1, name: 'Rose', type: 'Flower', status: 'Planted', datePlanted: '2023-01-01' },
      { _id: '2', gardenId: 1, name: 'Tulip', type: 'Flower', status: 'Planted', datePlanted: '2023-01-02' }
    ];

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(plantService, 'deletePlant').and.returnValue(of({}));
    component.plants = mockPlants;

    component.deletePlant('1');
    fixture.detectChanges(); // Update the view with the deletion state

    expect(component.plants.length).toBe(1);
    expect(component.plants[0]._id).toBe('2');
  });
});
