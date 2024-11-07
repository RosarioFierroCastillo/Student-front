import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUsuarios2Component } from './home-usuarios2.component';

describe('HomeUsuarios2Component', () => {
  let component: HomeUsuarios2Component;
  let fixture: ComponentFixture<HomeUsuarios2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeUsuarios2Component]
    });
    fixture = TestBed.createComponent(HomeUsuarios2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
