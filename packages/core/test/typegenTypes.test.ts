import { assign, interpret } from '../src';
import { createMachine } from '../src/Machine';
import { createModel } from '../src/model';
import { TypegenMeta } from '../src/typegenTypes';

describe('typegen types', () => {
  it('should not require implementations when creating machine using `createMachine`', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: 'fooAction';
        delays: 'barDelay';
        guards: 'bazGuard';
        services: 'qwertyService';
      };
    }
    createMachine({
      tsTypes: {} as TypesMeta
    });
  });

  it('should not require implementations when creating machine using `model.createMachine`', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: 'fooAction';
        delays: 'barDelay';
        guards: 'bazGuard';
        services: 'qwertyService';
      };
    }

    const model = createModel({});

    model.createMachine({
      tsTypes: {} as TypesMeta
    });
  });

  it('should limit event type provided to an action', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
      };
      eventsCausingActions: {
        myAction: 'FOO' | 'BAR';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        context: { foo: 100 },
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
        }
      },
      {
        actions: {
          myAction: (_ctx, event) => {
            event.type === 'FOO';
            event.type === 'BAR';
            // @ts-expect-error
            event.type === 'BAZ';
          }
        }
      }
    );
  });

  it('should limit event type provided to a delay', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
      };
      eventsCausingDelays: {
        myDelay: 'FOO' | 'BAR';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        context: { foo: 100 },
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
        }
      },
      {
        delays: {
          myDelay: (_ctx, event) => {
            event.type === 'FOO';
            event.type === 'BAR';
            // @ts-expect-error
            event.type === 'BAZ';

            return 42;
          }
        }
      }
    );
  });

  it('should limit event type provided to a guard', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
      };
      eventsCausingGuards: {
        myGuard: 'FOO' | 'BAR';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        context: { foo: 100 },
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
        }
      },
      {
        guards: {
          myGuard: (_ctx, event) => {
            event.type === 'FOO';
            event.type === 'BAR';
            // @ts-expect-error
            event.type === 'BAZ';

            return true;
          }
        }
      }
    );
  });

  it('should limit event type provided to a service', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
      };
      eventsCausingServices: {
        myService: 'FOO' | 'BAR';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        context: { foo: 100 },
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
        }
      },
      {
        services: {
          myService: (_ctx, event) => {
            event.type === 'FOO';
            event.type === 'BAR';
            // @ts-expect-error
            event.type === 'BAZ';

            return () => {};
          }
        }
      }
    );
  });

  it('should not allow an unknown action', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
      };
      eventsCausingActions: {
        myAction: 'FOO' | 'BAR';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        context: { foo: 100 },
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
        }
      },
      {
        actions: {
          // @ts-expect-error
          unknownAction: () => {}
        }
      }
    );
  });

  it('should not allow an unknown delay', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
      };
      eventsCausingDelays: {
        myDelay: 'FOO' | 'BAR';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        context: { foo: 100 },
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
        }
      },
      {
        delays: {
          // @ts-expect-error
          unknownDelay: () => 42
        }
      }
    );
  });

  it('should not allow an unknown guard', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
      };
      eventsCausingGuards: {
        myGuard: 'FOO' | 'BAR';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        context: { foo: 100 },
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
        }
      },
      {
        guards: {
          // @ts-expect-error
          unknownGuard: () => true
        }
      }
    );
  });

  it('should not allow an unknown service', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
      };
      eventsCausingServices: {
        myService: 'FOO' | 'BAR';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        context: { foo: 100 },
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
        }
      },
      {
        services: {
          // @ts-expect-error
          unknownService: () => () => {}
        }
      }
    );
  });

  it('should allow valid string `matches`', () => {
    interface TypesMeta extends TypegenMeta {
      matchesStates: 'a' | 'b' | 'c';
    }

    const machine = createMachine({
      tsTypes: {} as TypesMeta,
      context: { foo: 100 },
      schema: {
        events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
      },
      initial: 'a',
      states: {
        a: {}
      }
    });

    machine.initialState.matches('a');
  });

  it('should allow valid object `matches`', () => {
    interface TypesMeta extends TypegenMeta {
      matchesStates: 'a' | { a: 'b' } | { a: 'c' };
    }

    const machine = createMachine({
      tsTypes: {} as TypesMeta,
      context: { foo: 100 },
      initial: 'a',
      states: {
        a: {}
      }
    });

    machine.initialState.matches({ a: 'c' });
  });

  it('should not allow invalid string `matches`', () => {
    interface TypesMeta extends TypegenMeta {
      matchesStates: 'a' | 'b' | 'c';
    }

    const machine = createMachine({
      tsTypes: {} as TypesMeta,
      context: { foo: 100 },
      schema: {
        events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
      },
      initial: 'a',
      states: {
        a: {}
      }
    });

    // @ts-expect-error
    machine.initialState.matches('d');
  });

  it('should allow invalid object `matches`', () => {
    interface TypesMeta extends TypegenMeta {
      matchesStates: 'a' | { a: 'b' } | { a: 'c' };
    }

    const machine = createMachine({
      tsTypes: {} as TypesMeta,
      context: { foo: 100 },
      initial: 'a',
      states: {
        a: {}
      }
    });

    // @ts-expect-error
    machine.initialState.matches({ a: 'd' });
  });

  it('should allow a valid tag with `hasTag`', () => {
    interface TypesMeta extends TypegenMeta {
      tags: 'a' | 'b' | 'c';
    }

    const machine = createMachine({
      tsTypes: {} as TypesMeta,
      context: { foo: 100 },
      schema: {
        events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
      },
      initial: 'a',
      states: {
        a: {}
      }
    });

    machine.initialState.hasTag('a');
  });

  it('should not allow an invalid tag with `hasTag`', () => {
    interface TypesMeta extends TypegenMeta {
      tags: 'a' | 'b' | 'c';
    }

    const machine = createMachine({
      tsTypes: {} as TypesMeta,
      context: { foo: 100 },
      schema: {
        events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
      },
      initial: 'a',
      states: {
        a: {}
      }
    });

    // @ts-expect-error
    machine.initialState.hasTag('d');
  });

  it('`withConfig` should require all missing implementations ', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: 'myAction';
        delays: 'myDelay';
        guards: never;
        services: never;
      };
      eventsCausingActions: {
        myAction: 'FOO';
        myDelay: 'BAR';
      };
    }

    const machine = createMachine({
      tsTypes: {} as TypesMeta,
      schema: {
        events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
      }
    });

    // @ts-expect-error
    machine.withConfig({});
    machine.withConfig({
      // @ts-expect-error
      actions: {}
    });
    // @ts-expect-error
    machine.withConfig({
      actions: {
        myAction: () => {}
      }
    });
    machine.withConfig({
      actions: {
        myAction: () => {}
      },
      delays: {
        myDelay: () => 42
      }
    });
  });

  it('should allow to create a service out of a machine without any missing implementations', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
      };
    }

    const machine = createMachine({
      tsTypes: {} as TypesMeta
    });

    interpret(machine);
  });

  it('should not allow to create a service out of a machine with missing implementations', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: 'myAction';
        delays: never;
        guards: never;
        services: never;
      };
      eventsCausingActions: {
        myAction: 'FOO';
      };
    }

    const machine = createMachine({
      tsTypes: {} as TypesMeta,
      schema: {
        events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
      }
    });

    // @ts-expect-error
    interpret(machine);
  });

  it('should allow to create a service out of a machine with implementations provided through `withConfig`', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: 'myAction';
        delays: never;
        guards: never;
        services: never;
      };
      eventsCausingActions: {
        myAction: 'FOO';
      };
    }

    const machine = createMachine({
      tsTypes: {} as TypesMeta,
      schema: {
        events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
      }
    });

    interpret(
      machine.withConfig({
        actions: {
          myAction: () => {}
        }
      })
    );
  });

  it('should not require all implementations when creating machine', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: 'fooAction';
        delays: 'barDelay';
        guards: 'bazGuard';
        services: 'qwertyService';
      };
      eventsCausingActions: { fooAction: 'FOO' };
      eventsCausingDelays: { barDelay: 'BAR' };
      eventsCausingGuards: { bazGuard: 'BAR' };
      eventsCausingServices: { qwertyService: 'BAR' };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
        }
      },
      {
        actions: {
          fooAction: () => {}
        }
      }
    );
  });

  it('should allow to override already provided implementation using `withConfig`', () => {
    interface TypesMeta extends TypegenMeta {
      missingImplementations: {
        actions: 'fooAction';
        delays: never;
        guards: never;
        services: never;
      };
      eventsCausingActions: { fooAction: 'FOO' };
      eventsCausingDelays: { barDelay: 'BAR' };
    }

    const machine = createMachine(
      {
        tsTypes: {} as TypesMeta,
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR' } | { type: 'BAZ' }
        }
      },
      {
        delays: {
          barDelay: () => 42
        }
      }
    );

    machine.withConfig({
      actions: {
        fooAction: () => {}
      },
      delays: {
        barDelay: () => 100
      }
    });
  });

  it('should preserve provided action type for the meta object', () => {
    interface TypesMeta extends TypegenMeta {
      eventsCausingActions: {
        myAction: 'FOO' | 'BAR';
      };
    }

    const model = createModel(
      { foo: 100 },
      {
        actions: {
          myAction: (x: number) => ({ x })
        },
        events: {
          FOO: () => ({}),
          BAR: () => ({}),
          BAZ: () => ({})
        }
      }
    );

    model.createMachine(
      {
        tsTypes: {} as TypesMeta
      },
      {
        actions: {
          myAction: (_ctx, _ev, { action }) => {
            action.type === 'myAction';
            ((_accept: number) => {})(action.x);
            // @ts-expect-error
            ((_accept: string) => {})(action.x);
          }
        }
      }
    );
  });

  it('should include init event in the provided parameter type if necessary', () => {
    interface TypesMeta extends TypegenMeta {
      eventsCausingActions: {
        myAction: 'xstate.init';
      };
      internalEvents: {
        'xstate.init': { type: 'xstate.init' };
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR' }
        }
      },
      {
        actions: {
          myAction: (_ctx, event) => {
            event.type === 'xstate.init';
          }
        }
      }
    );
  });

  it('should include generated dynamic internal event in the provided parameter if an explicit one is not provided', () => {
    interface TypesMeta extends TypegenMeta {
      eventsCausingActions: {
        myAction: 'done.invoke.myService' | 'FOO';
      };
      internalEvents: {
        'done.invoke.myService': {
          type: 'done.invoke.myService';
          data: unknown;
          __tip: 'Declare the type.';
        };
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR' }
        }
      },
      {
        actions: {
          myAction: (_ctx, event) => {
            if (event.type === 'FOO') {
              return;
            }
            event.type === 'done.invoke.myService';
            event.data;
            // indirectly check that it's not any
            // @ts-expect-error
            ((_accept: string) => {})(event.data);
          }
        }
      }
    );
  });

  it('should use an explicitly provided event type for a dynamic internal event over the generated one', () => {
    interface TypesMeta extends TypegenMeta {
      eventsCausingActions: {
        myAction: 'done.invoke.myService' | 'FOO';
      };
      internalEvents: {
        'done.invoke.myService': {
          type: 'done.invoke.myService';
          data: unknown;
          __tip: 'Declare the type.';
        };
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        schema: {
          events: {} as
            | { type: 'FOO' }
            | { type: 'BAR' }
            | { type: 'done.invoke.myService'; data: string }
        }
      },
      {
        actions: {
          myAction: (_ctx, event) => {
            if (event.type === 'FOO') {
              return;
            }
            event.type === 'done.invoke.myService';
            event.data;
            ((_accept: string) => {})(event.data);
          }
        }
      }
    );
  });

  it('should allow a promise service returning the explicitly declared data in the given done.invoke', () => {
    interface TypesMeta extends TypegenMeta {
      eventsCausingServices: {
        myService: 'FOO';
      };
      internalEvents: {
        'done.invoke.myService': {
          type: 'done.invoke.myService';
          data: unknown;
          __tip: 'Declare the type.';
        };
      };
      invokeSrcNameMap: {
        myService: 'done.invoke.myService';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        schema: {
          events: {} as
            | { type: 'FOO' }
            | { type: 'done.invoke.myService'; data: string }
        }
      },
      {
        services: {
          myService: (_ctx) => Promise.resolve('foo')
        }
      }
    );
  });

  it('should not allow a promise service returning a different type than the explicitly declared one in the given done.invoke', () => {
    interface TypesMeta extends TypegenMeta {
      eventsCausingServices: {
        myService: 'FOO';
      };
      internalEvents: {
        'done.invoke.myService': {
          type: 'done.invoke.myService';
          data: unknown;
          __tip: 'Declare the type.';
        };
      };
      invokeSrcNameMap: {
        myService: 'done.invoke.myService';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        schema: {
          events: {} as
            | { type: 'FOO' }
            | { type: 'done.invoke.myService'; data: string }
        }
      },
      {
        services: {
          // @ts-expect-error
          myService: (_ctx) => Promise.resolve(42)
        }
      }
    );
  });

  it('should allow a machine service returning the explicitly declared data in the given done.invoke', () => {
    interface TypesMeta extends TypegenMeta {
      eventsCausingServices: {
        myService: 'FOO';
      };
      internalEvents: {
        'done.invoke.myService': {
          type: 'done.invoke.myService';
          data: unknown;
          __tip: 'Declare the type.';
        };
      };
      invokeSrcNameMap: {
        myService: 'done.invoke.myService';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        schema: {
          events: {} as
            | { type: 'FOO' }
            | { type: 'done.invoke.myService'; data: { foo: string } }
        }
      },
      {
        services: {
          myService: (_ctx) => createMachine<{ foo: string }>({})
        }
      }
    );
  });

  it('should not allow a machine service returning a different type than the explicitly declared one in the given done.invoke', () => {
    interface TypesMeta extends TypegenMeta {
      eventsCausingServices: {
        myService: 'FOO';
      };
      internalEvents: {
        'done.invoke.myService': {
          type: 'done.invoke.myService';
          data: unknown;
          __tip: 'Declare the type.';
        };
      };
      invokeSrcNameMap: {
        myService: 'done.invoke.myService';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        schema: {
          events: {} as
            | { type: 'FOO' }
            | { type: 'done.invoke.myService'; data: { foo: string } }
        }
      },
      {
        services: {
          // @ts-expect-error
          myService: (_ctx) => createMachine<{ foo: number }>({})
        }
      }
    );
  });

  it('should infer an action object with narrowed event type', () => {
    interface TypesMeta extends TypegenMeta {
      eventsCausingActions: {
        actionName: 'BAR';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR'; value: string }
        }
      },
      {
        actions: {
          actionName: assign((_context, event) => {
            ((_accept: 'BAR') => {})(event.type);
            return {};
          })
        }
      }
    );
  });

  it('should allow for `tsTypes: true` to allow for explicit typegen opt-in', () => {
    interface TypesMeta extends TypegenMeta {}

    createMachine<
      unknown,
      { type: 'FOO' } | { type: 'BAR'; value: string },
      any,
      TypesMeta
    >({
      tsTypes: true
    });
  });

  it('should accept a machine as a service', () => {
    interface TypesMeta extends TypegenMeta {
      eventsCausingServices: {
        fooService: 'FOO';
      };
    }

    createMachine(
      {
        tsTypes: {} as TypesMeta,
        schema: {
          events: {} as { type: 'FOO' } | { type: 'BAR'; value: string }
        }
      },
      {
        services: {
          fooService: createMachine({})
        }
      }
    );
  });
});
