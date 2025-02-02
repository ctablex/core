import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { addProps } from './add-props';

describe('add props', () => {
  it('should accept children from props', () => {
    const { container } = render(addProps(<div />, { children: 'a' }));
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div>a</div>"`);
  });
  it('should respect element children', () => {
    const { container } = render(addProps(<div>b</div>, { children: 'a' }));
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div>b</div>"`);
  });
  it('should accept props', () => {
    const { container } = render(addProps(<div />, { id: 'a' }));
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div id="a"></div>"`);
  });
  it('should keep element props', () => {
    const { container } = render(addProps(<div id="a" />, {}));
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div id="a"></div>"`);
  });
  it('should respect element props', () => {
    const { container } = render(addProps(<div id="b" />, { id: 'a' }));
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div id="b"></div>"`);
  });
  it('should accept children and props', () => {
    const { container } = render(addProps(<div />, { children: 'a', id: 'b' }));
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div id="b">a</div>"`);
  });
  it('should respect element children and props', () => {
    const { container } = render(
      addProps(<div id="c">d</div>, { children: 'a', id: 'b' }),
    );
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div id="c">d</div>"`);
  });
  it('should merge props', () => {
    const { container } = render(
      addProps(<div id="c">d</div>, { className: 'b' }),
    );
    expect(container.innerHTML).toMatchInlineSnapshot(
      `"<div id="c" class="b">d</div>"`,
    );
  });
  it('should merge props with respect to element props', () => {
    const { container } = render(
      addProps(
        <div id="c" className="a">
          d
        </div>,
        { className: 'b', title: 'e' },
      ),
    );
    expect(container.innerHTML).toMatchInlineSnapshot(
      `"<div id="c" class="a" title="e">d</div>"`,
    );
  });
  it('should respect element empty array children', () => {
    const { container } = render(addProps(<div>{[]}</div>, { children: 'a' }));
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div></div>"`);
  });
  it('should respect element null children', () => {
    const { container } = render(
      addProps(<div>{null}</div>, { children: 'a' }),
    );
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div></div>"`);
  });
  it('should respect element undefined children', () => {
    const { container } = render(
      addProps(<div>{undefined}</div>, { children: 'a' }),
    );
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div></div>"`);
  });
});
