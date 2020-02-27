import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTodoService } from 'src/testing/todo.service.mock';
import { AddTodoComponent } from './add-todo.component';
import { TodoService } from './todo.service';

describe('AddTodoComponent', () => {
  let addTodoComponent: AddTodoComponent;
  let addTodoForm: FormGroup;
  let calledClose: boolean;
  let fixture: ComponentFixture<AddTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [AddTodoComponent],
      providers: [{ provide: TodoService, useValue: new MockTodoService() }]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    calledClose = false;
    fixture = TestBed.createComponent(AddTodoComponent);
    addTodoComponent = fixture.componentInstance;
    addTodoComponent.ngOnInit();
    fixture.detectChanges();
    addTodoForm = addTodoComponent.addTodoForm;
    expect(addTodoForm).toBeDefined();
    expect(addTodoForm.controls).toBeDefined();
  });

  // Not terribly important; if the component doesn't create
  // successfully that will probably blow up a lot of things.
  // Including it, though, does give us confidence that our
  // our component definitions don't have errors that would
  // prevent them from being successfully constructed.
  it('should create the component and form', () => {
    expect(addTodoComponent).toBeTruthy();
    expect(addTodoForm).toBeTruthy();
  });

  // Confirms that an initial, empty form is *not* valid, so
  // people can't submit an empty form.
  it('form should be invalid when empty', () => {
    expect(addTodoForm.valid).toBeFalsy();
  });

  describe('The owner field', () => {
    let ownerControl: AbstractControl;

    beforeEach(() => {
      ownerControl = addTodoComponent.addTodoForm.controls[`owner`];
    });

    it('should not allow empty owners', () => {
      ownerControl.setValue('');
      expect(ownerControl.valid).toBeFalsy();
    });

    it('should be fine with "Blanche"', () => {
      ownerControl.setValue('Blanche');
      expect(ownerControl.valid).toBeTruthy();
    });

    it('should fail on single character owners', () => {
      ownerControl.setValue('x');
      expect(ownerControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.minLength(2)`.
      expect(ownerControl.hasError('minlength')).toBeTruthy();
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like owner lengths just
    // because there are owners with really long names.
    it('should fail on really long owners', () => {
      ownerControl.setValue('x'.repeat(100));
      expect(ownerControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(ownerControl.hasError('maxlength')).toBeTruthy();
    });

    it('should not allow a owner to contain a symbol', () => {
      ownerControl.setValue('bad@email.com');
      expect(ownerControl.valid).toBeFalsy();
      expect(ownerControl.hasError('pattern')).toBeTruthy();
    });

    it('should allow digits in the owner', () => {
      ownerControl.setValue('Bad2Th3B0ne');
      expect(ownerControl.valid).toBeTruthy();
    });

    it('should fail if we provide an "existing" owner', () => {
      // We're assuming that "abc123" and "123abc" already
      // exist so we disallow them.
      ownerControl.setValue('abc123');
      expect(ownerControl.valid).toBeFalsy();
      expect(ownerControl.hasError('existingOwner')).toBeTruthy();

      ownerControl.setValue('123abc');
      expect(ownerControl.valid).toBeFalsy();
      expect(ownerControl.hasError('existingOwner')).toBeTruthy();
    });
  });

  describe('The category field', () => {
    it('should not allow empty values', () => {
      const categoryControl = addTodoForm.controls[`category`];
      categoryControl.setValue('');
      expect(categoryControl.valid).toBeFalsy();
      expect(categoryControl.hasError('required')).toBeTruthy();
    });
  });

  describe('The body field', () => {
    it('should allow empty values', () => {
      const bodyControl = addTodoForm.controls[`body`];
      bodyControl.setValue('');
      expect(bodyControl.valid).toBeTruthy();
    });
  });

  describe('The status field', () => {
    let statusControl: AbstractControl;

    beforeEach(() => {
      statusControl = addTodoForm.controls[`status`];
    });

    it('should not allow empty values', () => {
      statusControl.setValue('');
      expect(statusControl.valid).toBeFalsy();
      expect(statusControl.hasError('required')).toBeTruthy();
    });

    it('should allow "true"', () => {
      statusControl.setValue('true');
      expect(statusControl.valid).toBeTruthy();
    });

    it('should allow "false"', () => {
      statusControl.setValue('false');
      expect(statusControl.valid).toBeTruthy();
    });

    it('should not allow "Turtles"', () => {
      statusControl.setValue('Turtles');
      expect(statusControl.valid).toBeFalsy();
    });
  });
});
