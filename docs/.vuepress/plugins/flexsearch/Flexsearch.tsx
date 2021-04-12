import type { Index } from 'flexsearch';
import type FlexSearchType from 'flexsearch';
import { h, watchEffect, defineComponent, computed, ref, onMounted, PropType } from "vue";
import { usePagesData } from "@vuepress/client";
import { useRouter } from "vue-router";
import type { PageData } from "@vuepress/shared";

const FlexSearch = require('flexsearch') as typeof FlexSearchType;

const SEARCH_HOTKEYS = ["."];

type SearchPageData = PageData<{
  header1?: string;
  header2?: string;
  header3?: string;
}>;

export default defineComponent({
  name: 'Docsearch',
  props: {
    placeholder: {
      type: String,
      default: ""
    }
  },
  setup({
    placeholder
  }: {
    placeholder: string
  }) {
    const index = ref(null as Index<SearchPageData> | null);
    const query = ref("");
    const focusIndex = ref(-1);
    const focused = ref(false);
    const input = ref(null as HTMLInputElement | null);
    const searchId = ref(0);
    const currentSearch = ref("");


    const $router = useRouter();
    const $pages = usePagesData();

    async function loadAll() {
      const pages = [] as PageData[];
      for (const [, pageRef] of Object.entries($pages.value)) {
        const page = await pageRef();

        pages.push(page);
      }
      return pages;
    }

    onMounted(() => {
      index.value = FlexSearch.create({
        tokenize: "forward",
        doc: {
          id: "key",
          field: ["title", "frontmatter", "header2", "header3"],
        },
      });

      loadAll().then((pages) => {
        pages.forEach((page) => index.value?.add({
          ...page,
          header1: page.headers[0]?.title,
          header2: page.headers[1]?.title,
          header3: page.headers[2]?.title
        }));
      });
    });

    const suggestions = ref([] as { link: string; value: SearchPageData }[]);

    function onHotkey(event: KeyboardEvent) {
      if (
        event.srcElement === document.body &&
        SEARCH_HOTKEYS.includes(event.key)
      ) {
        input.value?.focus();
        event.preventDefault();
      }
    }

    function onUp() {
      if (showSuggestions.value) {
        if (focusIndex.value > 0) {
          focusIndex.value--;
        } else {
          focusIndex.value = suggestions.value.length - 1;
        }
      }
    }

    function onDown() {
      if (showSuggestions.value) {
        if (focusIndex.value < suggestions.value.length - 1) {
          focusIndex.value++;
        } else {
          focusIndex.value = 0;
        }
      }
    }

    function go(i: number) {
      if (!showSuggestions.value) {
        return;
      }
      const path = suggestions.value[i]?.value.path;
      $router.push(path);
      currentSearch.value = "";
      searchId.value = 0;
      query.value = "";
      focusIndex.value = 0;
    }

    function focus(i: number) {
      focusIndex.value = i;
    }

    function unfocus() {
      focusIndex.value = -1;
    }

    function getQuerySnippet(page: PageData) {
      return page.title;
    }

    function querySearchAsync(
      queryString: string,
      cb: (links: { value: PageData; link: string }[]) => void
    ) {
      const query = queryString.trim().toLowerCase();
      const maxResults = 10;

      if (index.value === null || query.length < 3) {
        return cb([]);
      }

      index.value.search(
        query,
        {
          limit: maxResults
        },
        (result) => {
          if (result.length > 0) {
            const resolvedResult = result.map((page) => {
              return {
                link: page.path,
                value: page,
              };
            });
            return cb(resolvedResult);
          } else {
            return cb([
              {
                value: { title: `No results...` } as PageData,
                link: `#`,
              },
            ]);
          }
        }
      );
    }

    watchEffect(() => {
      if (!query.value) {
        suggestions.value = [];
        return;
      }

      // TODO: Only accept the most recent search results.
      if (currentSearch.value !== query.value) {
        searchId.value++;
        currentSearch.value = query.value;
      }

      const id = searchId.value;

      querySearchAsync(query.value, (results) => {
        if (id === searchId.value) {
          suggestions.value = results.slice(0, 10);
        }
      });
    });

    const showSuggestions = computed(() => {
      return focused.value && !!suggestions.value?.length;
    });

    // TODO: Clean this up.
    return () => (
      <div class="search-box">
        <input
          ref="input"
          aria-label="Search"
          value={query.value}
          class={focused.value ? 'focused' : ''}
          placeholder={placeholder}
          autocomplete="off"
          spellcheck="false"
          onInput={$event => {
            // @ts-expect-error
            query.value = $event.target.value
          }}
          onFocus={() => focused.value = true}
          onBlur={() => focused.value = false}
          onKeyup={$event => $event.key == 'enter' && go(focusIndex.value)}
          onKeydown={() => onDown()}
        />
        {showSuggestions.value &&
          <ul
            class={'suggestions'}
            onMouseleave={() => unfocus()}
          >
            {suggestions.value.map(
              ({ value: s }, i) => (
                <li
                  key={i}

                  class={i === focusIndex.value ? 'suggestion focused' : 'suggestion'}
                  onMousedown={() => go(i)}
                  onMouseenter={() => focus(i)}
                >
                  <a href={s.path} onClick={evt => evt.preventDefault()}>
                    <span class="page-title">{s.title || s.path}</span>
                    {s.header1 && s.header1?.toLowerCase().includes(query.value?.toLowerCase()) && <span class="header">&gt; {s.header1}</span>}
                    {s.header2 && s.header2?.toLowerCase().includes(query.value?.toLowerCase()) && <span class="header">&gt; {s.header2}</span>}
                    {s.header3 && s.header3?.toLowerCase().includes(query.value?.toLowerCase()) && <span class="header">&gt; {s.header3}</span>}
                  </a>
                </li>
              )
            )}
          </ul >}
      </div >
    );
  }
});
