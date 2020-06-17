import { newE2EPage } from '@stencil/core/testing';

describe('app-card-transition', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-card-transition></app-card-transition>');

    const element = await page.find('app-card-transition');
    expect(element).toHaveClass('hydrated');
  });
});
