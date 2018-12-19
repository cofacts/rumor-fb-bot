jest.mock('../../gql');

import initState from '../initState';
import * as apiResult from '../__fixtures__/initState';
import gql from '../../gql';

it('article found', async () => {
  gql.__push(apiResult.longArticle);

  const input = {
    data: {},
    state: '__INIT__',
    event: {
      type: 'message',
      input:
        '計程車上有裝悠遊卡感應器，老人悠悠卡可以享受優惠部分由政府補助，不影響司機收入',
      timestamp: 1497994016356,
      message: {
        type: 'text',
        id: '6270464463537',
        text:
          '計程車上有裝悠遊卡感應器，老人悠悠卡可以享受優惠部分由政府補助，不影響司機收入',
      },
    },
    issuedAt: 1497994017447,
    userId: 'Uc76d8ae9ccd1ada4f06c4e1515d46466',
    replies: undefined,
    isSkipUser: false,
  };

  expect(await initState(input)).toMatchSnapshot();
});

it('article found with 120 words limit', async () => {
  gql.__push(apiResult.twoLongArticles);

  const input = {
    data: {},
    state: '__INIT__',
    event: {
      type: 'message',
      input:
        '這樣的大事國內媒體竟然不敢報導！\n我國駐日代表將原「中華民國」申請更名為「台灣」結果被日本裁罰，須繳納7000萬日圓（合約台幣2100萬元）高額稅賦(轉載中時電子報）\n\n我駐日代表謝長廷將原「中華民國」申請更名為「台灣」，自認得意之時，結果遭自認友好日本國給出賣了，必須繳納7000萬日圓（合約台幣2100萬元）高額稅賦...民進黨沒想到如此更名竟然是這樣的下場：被他最信任也最友好的日本政府給坑了。\n果然錯誤的政策比貪污可怕，2100萬就這樣打水漂了，還要資助九州水患，核四停建違約賠償金.......夠全國軍公教退休2次.........\n\nhttp://www.chinatimes.com/newspapers/20170617000318-260118',
      timestamp: 1502477505309,
      message: {
        type: 'text',
        id: '6530038889933',
        text:
          '這樣的大事國內媒體竟然不敢報導！\n我國駐日代表將原「中華民國」申請更名為「台灣」結果被日本裁罰，須繳納7000萬日圓（合約台幣2100萬元）高額稅賦(轉載中時電子報）\n\n我駐日代表謝長廷將原「中華民國」申請更名為「台灣」，自認得意之時，結果遭自認友好日本國給出賣了，必須繳納7000萬日圓（合約台幣2100萬元）高額稅賦...民進黨沒想到如此更名竟然是這樣的下場：被他最信任也最友好的日本政府給坑了。\n果然錯誤的政策比貪污可怕，2100萬就這樣打水漂了，還要資助九州水患，核四停建違約賠償金.......夠全國軍公教退休2次.........\n\nhttp://www.chinatimes.com/newspapers/20170617000318-260118',
      },
    },
    issuedAt: 1502477506267,
    userId: 'Uc76d8ae9ccd1ada4f06c4e1515d46466',
    isSkipUser: false,
  };

  const result = await initState(input);

  for (let reply of result.replies) {
    if (reply.type === 'text') {
      expect(reply.content.text.length < 2000).toBe(true);
    } else if (reply.type === 'buttons') {
      expect(reply.content.attachment.payload.text.length < 640).toBe(true);
    } else if (reply.type === 'carousel') {
      for (let element of reply.content.attachment.payload.elements) {
        expect(element.title.length <= 80).toBe(true);
        expect(element.subtitle.length <= 80).toBe(true);
      }
    }
  }
});

it('articles found with high similarity', async () => {
  gql.__push(apiResult.twoShortArticles);

  const input = {
    data: {},
    state: '__INIT__',
    event: {
      type: 'message',
      input: 'YouTube · 寻找健康人生',
      timestamp: 1497994016356,
      message: {
        type: 'text',
        id: '6270464463537',
        text: 'YouTube · 寻找健康人生',
      },
    },
    issuedAt: 1497994017447,
    userId: 'Uc76d8ae9ccd1ada4f06c4e1515d46466',
    replies: undefined,
    isSkipUser: false,
  };

  expect(await initState(input)).toMatchSnapshot();
});

it('only one article found with high similarity', async () => {
  gql.__push(apiResult.shortArticle);

  const input = {
    data: {},
    state: '__INIT__',
    event: {
      type: 'message',
      input: 'YouTube · 寻找健康人生',
      timestamp: 1497994016356,
      message: {
        type: 'text',
        id: '6270464463537',
        text: 'YouTube · 寻找健康人生',
      },
    },
    issuedAt: 1497994017447,
    userId: 'Uc76d8ae9ccd1ada4f06c4e1515d46466',
    replies: undefined,
    isSkipUser: false,
  };

  expect(await initState(input)).toMatchSnapshot();
});

it('should handle article not found', async () => {
  gql.__push(apiResult.notFound);

  const input = {
    data: {},
    state: '__INIT__',
    event: {
      type: 'message',
      input:
        'YouTube · 寻找健康人生 驚！大批香蕉受到愛滋血污染！這種香蕉千萬不要吃！吃到可能會被 ...',
      timestamp: 1497994016356,
      message: {
        type: 'text',
        id: '6270464463537',
        text:
          'YouTube · 寻找健康人生 驚！大批香蕉受到愛滋血污染！這種香蕉千萬不要吃！吃到可能會被 ...',
      },
    },
    issuedAt: 1497994017447,
    userId: 'Uc76d8ae9ccd1ada4f06c4e1515d46466',
    replies: undefined,
    isSkipUser: false,
  };

  expect(await initState(input)).toMatchSnapshot();
});

afterEach(() => {
  gql.__reset();
});
