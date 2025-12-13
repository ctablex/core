import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ContentProvider, useContent } from '../content-provider';
import { ContentValue } from './content-value';
import { ArrayContent } from './array-content';
import { DefaultContent } from './default-content';
import { FieldContent } from './field-content';
import { IndexContent } from './index-content';
import { KeyContent } from './key-content';
import { NullableContent } from './nullable-content';
import { ObjectContent } from './object-content';
import { NullContent } from './null-content';
import { EmptyContent } from './empty-content';
import { NonEmptyContent } from './non-empty-content';

describe('content', () => {
  it('should render empty array', () => {
    render(
      <div data-testid="root">
        <ContentProvider value={[]}>
          <ArrayContent />
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root')).toBeEmptyDOMElement();
  });

  it('should render array', () => {
    render(
      <div data-testid="root">
        <ContentProvider value={['a', 'b']}>
          <ArrayContent />
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root')).toHaveTextContent('ab');
  });
  it('should render array with custom key', () => {
    render(
      <div data-testid="root">
        <ContentProvider value={['a', 'b']}>
          <ArrayContent<string> getKey={(value) => value} />
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root')).toHaveTextContent('ab');
  });

  it('should render array with join', () => {
    render(
      <div data-testid="root">
        <ContentProvider value={['a', 'b']}>
          <ArrayContent join=", " />
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root')).toHaveTextContent('a, b');
  });

  it('should render array with join element', () => {
    render(
      <div data-testid="root">
        <ContentProvider value={['a', 'b']}>
          <ArrayContent join={<br />} />
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root').innerHTML).toMatchInlineSnapshot(
      `"a<br>b"`,
    );
  });
  it('should render array with custom content', () => {
    render(
      <div data-testid="root">
        <ContentProvider value={['a', 'b']}>
          <ArrayContent>
            <code>
              <DefaultContent />
            </code>
          </ArrayContent>
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root').innerHTML).toMatchInlineSnapshot(
      `"<code>a</code><code>b</code>"`,
    );
  });
  it('should render array with index', () => {
    render(
      <div data-testid="root">
        <ContentProvider value={['a', 'b']}>
          <ArrayContent>
            <span>
              <IndexContent start={1} />. <DefaultContent />
            </span>
          </ArrayContent>
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root').innerHTML).toMatchInlineSnapshot(
      `"<span>1. a</span><span>2. b</span>"`,
    );
  });

  it('should render nested array', () => {
    render(
      <div data-testid="root">
        <ContentProvider
          value={[
            ['a', 'b'],
            ['c', 'd'],
          ]}
        >
          <ArrayContent join="|">
            <ArrayContent join="," />
          </ArrayContent>
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root')).toHaveTextContent('a,b|c,d');
  });
  it('should render nested array with custom children', () => {
    render(
      <div data-testid="root">
        <ContentProvider
          value={[
            ['a', 'b'],
            ['c', 'd'],
          ]}
        >
          <ArrayContent>
            <div>
              <ArrayContent>
                <span>
                  <DefaultContent />
                </span>
              </ArrayContent>
            </div>
          </ArrayContent>
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root').innerHTML).toMatchInlineSnapshot(
      `"<div><span>a</span><span>b</span></div><div><span>c</span><span>d</span></div>"`,
    );
  });
  it('should render array of object with fields', () => {
    render(
      <div data-testid="root">
        <ContentProvider value={[{ name: 'a', age: 5 }, { name: 'b' }]}>
          <ArrayContent join="|">
            name: <FieldContent field="name" />, age:{' '}
            <FieldContent field="age">
              <NullableContent nullContent="unknown" />
            </FieldContent>
            ,
          </ArrayContent>
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root')).toHaveTextContent(
      'name: a, age: 5,|name: b, age: unknown,',
    );
  });
  it('should render array of deep object', () => {
    interface Data {
      name: string;
      info: {
        color: 'string';
        weight: number;
      };
    }
    const data = [
      { name: 'a', info: { color: 'red', weight: 4 } },
      { name: 'b', info: { color: 'red', weight: 4 } },
    ];
    render(
      <div data-testid="root">
        <ContentProvider value={data}>
          <ArrayContent<Data> join="|" getKey="name">
            name: <ContentValue<Data> accessor="name" />, color:{' '}
            <ContentValue<Data> accessor="info.color" />, weight:{' '}
            <ContentValue<Data> accessor={(item) => item.info.weight} />
          </ArrayContent>
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root')).toHaveTextContent(
      'name: a, color: red, weight: 4|name: b, color: red, weight: 4',
    );
  });
  it('should render array of objects', () => {
    render(
      <div data-testid="root">
        <ContentProvider value={[{ name: 'a', age: 5 }, { name: 'b' }]}>
          <ArrayContent join="|">
            <ObjectContent join="," getKey={(v, k) => k}>
              <KeyContent />: <DefaultContent />
            </ObjectContent>
          </ArrayContent>
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root')).toHaveTextContent(
      'name: a,age: 5|name: b',
    );
  });

  it('should render array of objects with elements', () => {
    render(
      <div data-testid="root">
        <ContentProvider value={[{ name: 'a', age: 5 }, { name: 'b' }]}>
          <ArrayContent>
            <div>
              <ObjectContent>
                <span>
                  <KeyContent />: <DefaultContent />
                </span>
              </ObjectContent>
            </div>
          </ArrayContent>
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root').innerHTML).toMatchInlineSnapshot(
      `"<div><span>name: a</span><span>age: 5</span></div><div><span>name: b</span></div>"`,
    );
  });

  it('should render object with nested array', () => {
    render(
      <div data-testid="root">
        <ContentProvider
          value={{
            a: ['a', 'b'],
            c: ['c', 'd'],
          }}
        >
          <ObjectContent join="|">
            <KeyContent />: <ArrayContent join=", " />
          </ObjectContent>
        </ContentProvider>
      </div>,
    );
    expect(screen.getByTestId('root')).toHaveTextContent('a: a, b|c: c, d');
  });

  describe('nullable content', () => {
    it('should render nullable content with default nullContent', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={null}>
            <NullableContent>
              <ArrayContent />
            </NullableContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('');
    });

    it('should render nullable content with undefined content', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={undefined}>
            <NullableContent>
              <ArrayContent />
            </NullableContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('');
    });

    it('should render nullable content with custom nullContent', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={null}>
            <NullableContent nullContent="No Data">
              <ArrayContent />
            </NullableContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('No Data');
    });

    it('should render nullable content with non-null content', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={['x', 'y']}>
            <NullableContent nullContent="No Data">
              <ArrayContent join=" " />
            </NullableContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('x y');
    });
  });

  describe('null content', () => {
    it('should render null content with null content', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={null}>
            <NullContent>No Data</NullContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('No Data');
    });

    it('should render null content with undefined content', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={undefined}>
            <NullContent>No Data</NullContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('No Data');
    });

    it('should render null content with non-null content', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={5}>
            <NullContent>No Data</NullContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('');
    });
  });

  describe('non empty content', () => {
    it('should not render non-empty content with null content', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={null}>
            <EmptyContent>
              <div>No Data</div>
            </EmptyContent>
            <NonEmptyContent>
              <ul>
                <ArrayContent>
                  <li>
                    <DefaultContent />
                  </li>
                </ArrayContent>
              </ul>
            </NonEmptyContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('No Data');
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
      expect(screen.getByTestId('root').innerHTML).toMatchInlineSnapshot(
        `"<div>No Data</div>"`,
      );
    });

    it('should not render non-empty content with undefined content', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={undefined}>
            <EmptyContent>
              <div>No Data</div>
            </EmptyContent>
            <NonEmptyContent>
              <ul>
                <ArrayContent>
                  <li>
                    <DefaultContent />
                  </li>
                </ArrayContent>
              </ul>
            </NonEmptyContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('No Data');
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
      expect(screen.getByTestId('root').innerHTML).toMatchInlineSnapshot(
        `"<div>No Data</div>"`,
      );
    });

    it('should not render non-empty content with empty array', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={[]}>
            <EmptyContent>
              <div>No Data</div>
            </EmptyContent>
            <NonEmptyContent>
              <ul>
                <ArrayContent>
                  <li>
                    <DefaultContent />
                  </li>
                </ArrayContent>
              </ul>
            </NonEmptyContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('No Data');
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
      expect(screen.getByTestId('root').innerHTML).toMatchInlineSnapshot(
        `"<div>No Data</div>"`,
      );
    });

    it('should render non-empty content with non-empty array', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={[1, 2, 3]}>
            <EmptyContent>
              <div>No Data</div>
            </EmptyContent>
            <NonEmptyContent>
              <ul>
                <ArrayContent>
                  <li>
                    <DefaultContent />
                  </li>
                </ArrayContent>
              </ul>
            </NonEmptyContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root').innerHTML).toMatchInlineSnapshot(
        `"<ul><li>1</li><li>2</li><li>3</li></ul>"`,
      );
    });

    it('should render non-empty content with custom isEmpty', () => {
      const isEmpty = (content: object) => {
        return Object.keys(content).length === 0;
      };
      render(
        <div data-testid="root">
          <ContentProvider value={{ name: 'test', age: 30 }}>
            <EmptyContent<object> isEmpty={isEmpty}>
              <div>No Data</div>
            </EmptyContent>
            <NonEmptyContent<object> isEmpty={isEmpty}>
              <ul>
                <ObjectContent>
                  <li>
                    <KeyContent />: <DefaultContent />
                  </li>
                </ObjectContent>
              </ul>
            </NonEmptyContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.queryByText('No Data')).not.toBeInTheDocument();
      expect(screen.getByTestId('root').innerHTML).toMatchInlineSnapshot(
        `"<ul><li>name: test</li><li>age: 30</li></ul>"`,
      );
    });

    it('should render non-empty content with custom isEmpty and empty content', () => {
      const isEmpty = (content: object) => {
        return Object.keys(content).length === 0;
      };
      render(
        <div data-testid="root">
          <ContentProvider value={{}}>
            <EmptyContent<object> isEmpty={isEmpty}>
              <div>No Data</div>
            </EmptyContent>
            <NonEmptyContent<object> isEmpty={isEmpty}>
              <ul>
                <ObjectContent>
                  <li>
                    <KeyContent />: <DefaultContent />
                  </li>
                </ObjectContent>
              </ul>
            </NonEmptyContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByText('No Data')).toBeInTheDocument();
      expect(screen.getByTestId('root').innerHTML).toMatchInlineSnapshot(
        `"<div>No Data</div>"`,
      );
    });
  });

  describe('empty content', () => {
    it('should render empty content with null content', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={null}>
            <EmptyContent>No Data</EmptyContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('No Data');
    });

    it('should render empty content with undefined content', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={undefined}>
            <EmptyContent>No Data</EmptyContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('No Data');
    });

    it('should render empty content with empty array', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={[]}>
            <EmptyContent>No Data</EmptyContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('No Data');
    });

    it('should not render empty content with non-empty array', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={[1, 2, 3]}>
            <EmptyContent>No Data</EmptyContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('');
    });

    it('should not render empty content with non-array content', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={5}>
            <EmptyContent>No Data</EmptyContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('');
    });

    it('should render empty content with custom isEmpty', () => {
      const isEmpty = (content: object) => {
        return Object.keys(content).length === 0;
      };
      render(
        <div data-testid="root">
          <ContentProvider value={{}}>
            <EmptyContent<object> isEmpty={isEmpty}>No Data</EmptyContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('No Data');
    });
  });

  describe('mixed null and empty', () => {
    it('should render mixed empty and nullable content with null', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={null}>
            <NullableContent nullContent="No Data">
              <EmptyContent>Empty</EmptyContent>
              <ArrayContent join=", " />
            </NullableContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('No Data');
    });

    it('should render mixed empty and nullable content with undefined', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={undefined}>
            <NullableContent nullContent="No Data">
              <EmptyContent>Empty</EmptyContent>
              <ArrayContent join=", " />
            </NullableContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('No Data');
    });

    it('should render mixed empty and nullable content with empty array', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={[]}>
            <NullableContent nullContent="No Data">
              <EmptyContent>Empty</EmptyContent>
              <ArrayContent join=", " />
            </NullableContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('Empty');
    });

    it('should render mixed empty and nullable content with non-empty array', () => {
      render(
        <div data-testid="root">
          <ContentProvider value={[1, 2, 3]}>
            <NullableContent nullContent="No Data">
              <EmptyContent>Empty</EmptyContent>
              <ArrayContent join=", " />
            </NullableContent>
          </ContentProvider>
        </div>,
      );
      expect(screen.getByTestId('root')).toHaveTextContent('1, 2, 3');
    });
  });

  it('should accept value prop', () => {
    render(
      <div data-testid="root">
        <div data-testid="accessor">
          <ContentValue value={[1, 2, 3]} accessor={(a) => a.length} />
        </div>
        <div data-testid="array">
          <ArrayContent value={[1, 2, 3]} join=" " />
        </div>
        <div data-testid="object">
          <ObjectContent value={{ name: 'bob', age: 30 }} join="|">
            <KeyContent />: <DefaultContent />
          </ObjectContent>
        </div>
      </div>,
    );
    expect(screen.getByTestId('accessor')).toHaveTextContent('3');
    expect(screen.getByTestId('array')).toHaveTextContent('1 2 3');
    expect(screen.getByTestId('object')).toHaveTextContent('name: bob|age: 30');
  });
  it('should prefer value prop over context', () => {
    render(
      <div data-testid="root">
        <div data-testid="accessor">
          <ContentProvider value={[4, 5]}>
            <ContentValue value={[1, 2, 3]} accessor={(a) => a.length} />
            {' vs '}
            <ContentValue<number[]> accessor={(a) => a.length} />
          </ContentProvider>
        </div>
        <div data-testid="array">
          <ContentProvider value={[4, 5, 6]}>
            <ArrayContent value={[1, 2, 3]} join=" " />
            {' vs '}
            <ArrayContent join=" " />
          </ContentProvider>
        </div>
        <div data-testid="object">
          <ContentProvider value={{ name: 'alice', age: 20 }}>
            <ObjectContent value={{ name: 'bob', age: 30 }} join="|">
              <KeyContent />: <DefaultContent />
            </ObjectContent>
            {' vs '}
            <ContentValue<number[]> accessor={(a) => a.length} />
            <ObjectContent join="|">
              <KeyContent />: <DefaultContent />
            </ObjectContent>
          </ContentProvider>
        </div>
      </div>,
    );

    expect(screen.getByTestId('accessor').textContent).toBe('3 vs 2');
    expect(screen.getByTestId('array').textContent).toBe('1 2 3 vs 4 5 6');
    expect(screen.getByTestId('object').textContent).toBe(
      'name: bob|age: 30 vs name: alice|age: 20',
    );
  });

  it('should throw error if it used outside', () => {
    // @ts-ignore
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<DefaultContent />)).toThrowErrorMatchingInlineSnapshot(
      `[Error: useContent must be used within a ContentContext]`,
    );
    expect(() => render(<IndexContent />)).toThrowErrorMatchingInlineSnapshot(
      `[Error: useIndex must be used within a IndexContext]`,
    );
    expect(() => render(<KeyContent />)).toThrowErrorMatchingInlineSnapshot(
      `[Error: useKey must be used within a KeyContext]`,
    );
  });
  describe('useContent', () => {
    it('should respect value over context', () => {
      const { result } = renderHook(
        () => {
          const value1 = useContent<string>('value');
          const value2 = useContent<string>('');
          const value3 = useContent<number>(0);
          const value4 = useContent<string | null>(null);
          return { value1, value2, value3, value4 };
        },
        {
          wrapper: ({ children }) => (
            <ContentProvider value="context">{children}</ContentProvider>
          ),
        },
      );
      expect(result.current.value1).toBe('value');
      expect(result.current.value2).toBe('');
      expect(result.current.value3).toBe(0);
      expect(result.current.value4).toBe(null);
    });
    it('should respect context if value is undefined', () => {
      const { result } = renderHook(
        () => {
          const value1 = useContent<string>(undefined);
          const value2 = useContent<string>();
          return { value1, value2 };
        },
        {
          wrapper: ({ children }) => (
            <ContentProvider value="context">{children}</ContentProvider>
          ),
        },
      );
      expect(result.current.value1).toBe('context');
      expect(result.current.value2).toBe('context');
    });
    it('should not throw error if it have value', () => {
      const { result } = renderHook(() => {
        const value1 = useContent<string>('value');
        const value2 = useContent<string>('');
        const value3 = useContent<number>(0);
        const value4 = useContent<string | null>(null);
        return { value1, value2, value3, value4 };
      });
      expect(result.current.value1).toBe('value');
      expect(result.current.value2).toBe('');
      expect(result.current.value3).toBe(0);
      expect(result.current.value4).toBe(null);
    });
    it('should throw error if no context', () => {
      // @ts-ignore
      vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() =>
        renderHook(() => useContent<string>()),
      ).toThrowErrorMatchingInlineSnapshot(
        `[Error: useContent must be used within a ContentContext]`,
      );
    });
  });
});
