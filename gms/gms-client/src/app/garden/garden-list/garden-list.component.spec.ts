import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { GardenListComponent } from './garden-list.component';
import { GardenService } from '../garden.service';
import { of, throwError } from 'rxjs';
import { Garden } from '../garden';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('GardenListComponent', () => {
  let component: GardenListComponent;
  let fixture: ComponentFixture<GardenListComponent>;
  let gardenService: GardenService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, GardenListComponent], // Import GardenListComponent
      providers: [GardenService]
    }).compileComponents();

    fixture = TestBed.createComponent(GardenListComponent);
    component = fixture.componentInstance;
    gardenService = TestBed.inject(GardenService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display records in the DOM', () => {
    const mockGardens: Garden[] = [
      { _id: '1', gardenId: 1, name: 'Garden 1', location: 'Location 1', description: 'Description 1',
      dateCreated: '2024-09-04T21:39:36.605Z' },
      { _id: '2', gardenId: 2, name: 'Garden 2', location: 'Location 2', description: 'Description 2',
      dateCreated: '2024-09-05T21:39:36.605Z' }
    ];

    component.gardens = mockGardens;
    fixture.detectChanges(); // Trigger change detection

    const gardenRows = fixture.debugElement.queryAll(By.css('.garden-page__table-body .garden-page__table-row'));
    expect(gardenRows.length).toBeGreaterThan(0); // Check that there are garden rows in the DOM
  });

  it('should handle error when fetching gardens', () => {
    spyOn(gardenService, 'getGardens').and.returnValue(throwError('Error fetching gardens'));
    fixture.detectChanges(); // Trigger the component's constructor
    expect(component.gardens.length).toBe(0);
  });

  it('should delete a garden', () => {
    const mockGardens: Garden[] = [
      { _id: '1', gardenId: 1, name: 'Garden 1', location: 'Location 1', description: 'Description 1',
      dateCreated: '2024-09-04T21:39:36.605Z' },
      { _id: '2', gardenId: 2, name: 'Garden 2', location: 'Location 2', description: 'Description 2',
      dateCreated: '2024-09-05T21:39:36.605Z' }
    ];

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(gardenService, 'deleteGarden').and.returnValue(of({}));

    component.gardens = mockGardens;
    component.deleteGarden(1);
    fixture.detectChanges(); // Update the view with the deletion state

    expect(component.gardens.length).toBe(1);
    expect(component.gardens[0].gardenId).toBe(2);
  });

  it('should filter gardens based on search term', fakeAsync(() => {
    const mockGardens: Garden[] = [
      {
        _id: '1', gardenId: 1, name: 'Rose Garden', location: 'North', description: 'Beautiful roses',
        dateCreated: '2024-09-04T21:39:36.605Z'
      },
      {
        _id: '2', gardenId: 2, name: 'Tulip Garden', location: 'South', description: 'Colorful tulips',
        dateCreated: '2024-09-05T21:39:36.605Z'
      },
      {
        _id: '3', gardenId: 3, name: 'Sunflower Garden', location: 'East', description: 'Bright sunflowers',
        dateCreated: '2024-09-06T21:39:36.605Z'
      }
    ];

    component.gardens = mockGardens;
    component.allGardens = mockGardens;
    fixture.detectChanges(); // Trigger change detection

    component.txtSearchControl.setValue('Rose');
    tick(500); // Simulate debounce time
    fixture.detectChanges(); // Trigger change detection
    expect(component.gardens.length).toBe(1);
    expect(component.gardens[0].name).toBe('Rose Garden');

    component.txtSearchControl.setValue('Garden');
    tick(500); // Simulate debounce time
    fixture.detectChanges(); // Trigger change detection
    expect(component.gardens.length).toBe(3);

    component.txtSearchControl.setValue('Nonexistent');
    tick(500); // Simulate debounce time
    fixture.detectChanges(); // Trigger change detection
    expect(component.gardens.length).toBe(0);
  }));
});
