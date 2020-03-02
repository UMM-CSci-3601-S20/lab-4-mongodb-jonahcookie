import {TodoPage} from './todo-list.po';
import {browser, protractor, by, element} from 'protractor';

describe('Todo list', () => {
  let page: TodoPage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new TodoPage();
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    expect(page.getTodoTitle()).toEqual('Todos');
  });

  it('Should type something in the owner filter and check that it returned correct elements', async () => {
    await page.typeInput('todo-owner-input', 'Blanche');

    // All of the todo cards should have the name we are filtering by
    page.getTodoCards().each(e => {
      expect(e.element(by.className('todo-card-owner')).getText()).toEqual('Blanche');
    });
  });

  it('Should type something in the category filter and check that it returned correct elements', async () => {
    await page.typeInput('todo-category-input', 'software design');

    // All of the todo cards should have the company we are filtering by
    page.getTodoCards().each(e => {
      expect(e.element(by.className('todo-card-category')).getText()).toEqual('software design');
    });
  });

  it('Should type something partial in the category filter and check that it returned correct elements', async () => {
    await page.typeInput('todo-category-input', 'sof');

    // Go through each of the cards that are being shown and get the companies
    const companies = await page.getTodoCards().map(e => e.element(by.className('todo-card-category')).getText());

    // We should see this category
    expect(companies).toContain('software design');

    // We shouldn't see these categories
    expect(companies).not.toContain('video games');
    expect(companies).not.toContain('groceries');
    expect(companies).not.toContain('homework');
  });

  it('Should change the view', async () => {
    await page.changeView('list');

    expect(page.getTodoCards().count()).toEqual(0); // There should be no cards
    expect(page.getTodoListItems().count()).toBeGreaterThan(0); // There should be list items
  });

  it('Should select a status, switch the view, and check that it returned correct elements', async () => {
    await page.selectMatSelectValue('todo-status-select', 'true');
    await page.changeView('list');

    expect(page.getTodoListItems().count()).toBeGreaterThan(0);

    // All of the todo list items should have the status we are looking for
    page.getTodoListItems().each(e => {
      expect(e.element(by.className('todo-list-status')).getText()).toEqual('true');
    });


  });

  it('Should click view profile on a todo and go to the right URL', async () => {
    const firstTodoOwner = await page.getTodoCards().first().element(by.className('todo-card-owner')).getText();
    const firstTodoCategory = await page.getTodoCards().first().element(by.className('todo-card-category')).getText();
    await page.clickViewProfile(page.getTodoCards().first());

    // Wait until the URL contains 'todos/' (note the ending slash)
    await browser.wait(EC.urlContains('todos/'), 10000);

    // When the view profile button on the first todo card is clicked, the URL should have a valid mongo ID
    const url = await page.getUrl();
    expect(RegExp('.*\/todos\/[0-9a-fA-F]{24}$', 'i').test(url)).toBe(true);

    // On this profile page we were sent to, the owner and body should be correct
    expect(element(by.className('todo-card-owner')).getText()).toEqual(firstTodoOwner);
    expect(element(by.className('todo-card-category')).getText()).toEqual(firstTodoCategory);
  });

  it('Should click add todo and go to the right URL', async () => {
    await page.clickAddTodoFAB();

    // Wait until the URL contains 'todos/new'
    await browser.wait(EC.urlContains('todos/new'), 10000);

    // When the view profile button on the first todo card is clicked, we should be sent to the right URL
    const url = await page.getUrl();
    expect(url.endsWith('/todos/new')).toBe(true);

    // On this profile page we were sent to, We should see the right title
    expect(element(by.className('add-todo-title')).getText()).toEqual('New Todo');
  });

});
