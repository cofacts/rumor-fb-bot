import gql from '../gql';
import ga from '../ga';
import { getArticleURL } from './utils';

/**
 * The state that a user has decided whether to submit a new article.
 */
export default async function askingArticleSubmission(params) {
  let { data, state, event, issuedAt, userId, replies, isSkipUser } = params;

  if (!data.searchedText) {
    throw new Error('searchText not set in data');
  }

  const visitor = ga('FB-' + userId, data.searchedText);
  visitor.screenview({ screenName: state });

  if (event.input === 'y') {
    // Track whether user create Article or not if the Article is not found in DB.
    visitor.event({ ec: 'Article', ea: 'Create', el: 'Yes' });

    const reason = data.reasonText;
    const {
      data: { CreateArticle },
    } = await gql`
      mutation($text: String!, $reason: String!) {
        CreateArticle(text: $text, reason: $reason, reference: { type: FB }) {
          id
        }
      }
    `({ text: data.searchedText, reason }, { userId });

    replies = [
      {
        type: 'text',
        content: {
          text: `您回報的訊息已經被收錄至：${getArticleURL(CreateArticle.id)}`,
        },
      },
      { type: 'text', content: { text: '感謝您的回報！' } },
    ];
    state = '__INIT__';
  } else if (event.input === 'n') {
    // Track whether user create Article or not if the Article is not found in DB.
    visitor.send({ ec: 'Article', ea: 'Create', el: 'No' });

    replies = [
      { type: 'text', content: { text: '訊息沒有送出，謝謝您的使用。' } },
    ];
    state = '__INIT__';
  } else if (event.input === 'r') {
    replies = [{ type: 'text', content: { text: '好的，請重新填寫理由。' } }];
    state = 'ASKING_ARTICLE_SUBMISSION_REASON';
  }

  visitor.send();
  return { data, state, event, issuedAt, userId, replies, isSkipUser };
}
