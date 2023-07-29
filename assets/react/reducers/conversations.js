import conversationService from "../services/conversation";
import messageService from "../services/message";

const initialState = {
  potentialConversation: null,
  activeConversation: null,
  activeConversationMessages: [],
  conversations: [],
  error: null,
};

const conversationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CONVERSATIONS_SUCCESS":
      return {
        ...state,
        conversations: action.payload,
        error: null,
      };
    case "CREATE_POTENTIAL_CONVERSATION":
      return {
        ...state,
        potentialConversation: action.payload,
        activeConversation: action.payload,
        activeConversationMessages: [],
        error: null,
      };
    case "CREATE_CONVERSATION_AND_FIRST_MESSAGE_SUCCESS":
      return {
        potentialConversation: null,
        activeConversation: action.payload.newConversation,
        activeConversationMessages: state.activeConversationMessages.concat(
          action.payload.newMessage
        ),
        conversations: state.conversations.concat(
          action.payload.newConversation
        ),
        error: null,
      };
    case "CREATE_NEW_MESSAGE_SUCCESS":
      return {
        ...state,
        activeConversationMessages: state.activeConversationMessages.concat(
          action.payload.newMessage
        ),
        conversations: action.payload.updatedConversations.filter(
          (c) =>
            c.id_creator === action.payload.newMessage.id_sender ||
            c.id_correspondant === action.payload.newMessage.id_sender
        ),
        error: null,
      };
    case "ABORT_POTENTIAL_CONVERSATION_AND_SWITCH":
      return {
        ...state,
        potentialConversation: null,
        activeConversation: action.payload.newConversation,
        activeConversationMessages: state.activeConversationMessages.concat(
          action.payload.newMessage
        ),
      };
    case "ADD_CONVERSATION_RECEIVER":
      return {
        ...state,
        conversations: state.conversations.concat(action.payload),
      };
    case "UPDATE_CONVERSATION_RECEIVER":
      return {
        ...state,
        conversations: state.conversations.map((c) => {
          return c.id_convo === action.payload.id_convo
            ? { ...c, date_last_message: action.payload.sent_time }
            : c;
        }),
      };
    case "OPEN_CONVERSATION_MESSAGE_SUCCESS":
      return {
        ...state,
        potentialConversation: null,
        activeConversation: action.payload.activeConversation,
        activeConversationMessages: action.payload.activeConversationMessages,
        error: null,
      };
    case "UPDATE_RECEIVER_MESSAGES":
      return {
        ...state,
        activeConversationMessages: state.activeConversationMessages.concat(
          action.payload
        ),
      };
    case "FAILURE":
      return {
        ...state,
        conversations: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const conversationFetchAction = (userId) => async (dispatch) => {
  try {
    const conversations = await conversationService.getUserConvos(userId);
    dispatch({ type: "FETCH_CONVERSATIONS_SUCCESS", payload: conversations });
  } catch (e) {
    dispatch({ type: "FAILURE", payload: e.message });
  }
};

export const conversationAddAction =
  (newConversation, newMessage) => async (dispatch) => {
    try {
      const createdConversation = await conversationService.create(
        newConversation
      );
      const firstMessage = await messageService.create(newMessage);
      dispatch({
        type: "CREATE_CONVERSATION_AND_FIRST_MESSAGE_SUCCESS",
        payload: {
          newConversation: createdConversation,
          newMessage: firstMessage,
        },
      });
    } catch (e) {
      dispatch({ type: "FAILURE", payload: e.message });
    }
  };

export const conversationAddMessageAction =
  (newMessage) => async (dispatch) => {
    try {
      const addedMessage = await messageService.create(newMessage);
      const updatedConversations = await conversationService.modifyConvo(
        addedMessage.id_convo,
        addedMessage.sent_time
      );
      console.log("Updated conversations:", updatedConversations);
      dispatch({
        type: "CREATE_NEW_MESSAGE_SUCCESS",
        payload: {
          newMessage: addedMessage,
          updatedConversations: updatedConversations,
        },
      });
    } catch (e) {
      dispatch({ type: "FAILURE", payload: e.message });
    }
  };

export const conversationOpenMessagesAction = (convo) => async (dispatch) => {
  try {
    const conversationMessages = await messageService.getConvoMessages(
      convo.id_convo
    );
    dispatch({
      type: "OPEN_CONVERSATION_MESSAGE_SUCCESS",
      payload: {
        activeConversation: convo,
        activeConversationMessages: conversationMessages,
      },
    });
  } catch (e) {
    dispatch({ type: "FAILURE", payload: e.message });
  }
};

export default conversationsReducer;
