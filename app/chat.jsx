import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../util/constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

export default function Chat() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState(new Set());

  const reactions = ['❤️', '👍', '👎', '😂', '😮', '😢'];

  // Mock chat messages
  const [messages, setMessages] = useState([
    {
      id: 'm50',
      text: "Hey! How's your day going?",
      sender: 'user',
      timestamp: '2024-03-25T10:00:00Z',
      reactions: [],
    },
    {
      id: 'm49',
      text: "Pretty good! Just finished a big project at work 🎉",
      sender: params.id,
      timestamp: '2024-03-25T10:01:00Z',
      reactions: [],
    },
    {
      id: 'm48',
      text: "That's awesome! We should celebrate",
      sender: 'user',
      timestamp: '2024-03-25T10:02:00Z',
      reactions: [],
    },
    {
      id: 'm47',
      text: "Definitely! How about dinner tomorrow?",
      sender: params.id,
      timestamp: '2024-03-25T10:03:00Z',
      reactions: [],
    },
    {
      id: 'm46',
      text: "Perfect! That new Italian place?",
      sender: 'user',
      timestamp: '2024-03-25T10:04:00Z',
      reactions: [],
    },
    {
      id: 'm45',
      text: "Yes! I've heard great reviews about it",
      sender: params.id,
      timestamp: '2024-03-25T10:05:00Z',
      reactions: [],
    },
    {
      id: 'm44',
      text: "Should we invite others?",
      sender: 'user',
      timestamp: '2024-03-25T10:06:00Z',
      reactions: [],
    },
    {
      id: 'm43',
      text: "Maybe Sarah and Mike?",
      sender: params.id,
      timestamp: '2024-03-25T10:07:00Z',
      reactions: [],
    },
    {
      id: 'm42',
      text: "Good idea! I'll create a group",
      sender: 'user',
      timestamp: '2024-03-25T10:08:00Z',
      reactions: [],
    },
    {
      id: 'm41',
      text: "Great! What time works best?",
      sender: params.id,
      timestamp: '2024-03-25T10:09:00Z',
      reactions: [],
    },
    {
      id: 'm4',
      text: "Perfect, I'll transfer it right now",
      sender: params.id,
      timestamp: '2024-03-25T20:32:00Z',
      reactions: [],
    },
    {
      id: 'm3',
      text: "It was $45 for your share",
      sender: 'user',
      timestamp: '2024-03-25T20:31:30Z',
      reactions: [],
    },
    {
      id: 'm2',
      text: "Sure! Let me check the amount",
      sender: params.id,
      timestamp: '2024-03-25T20:31:00Z',
      reactions: [],
    },
    {
      id: 'm1',
      text: "Hey, can you settle up for the dinner?",
      sender: 'user',
      timestamp: '2024-03-25T20:30:00Z',
      reactions: [],
    },
  ]);

  const handleLongPress = (message) => {
    setSelectedMessage(message);
    setShowReactionMenu(true);
  };

  const handleReaction = (reaction) => {
    if (!selectedMessage) return;

    setMessages(prevMessages => prevMessages.map(msg => {
      if (msg.id === selectedMessage.id) {
        const existingReactionIndex = msg.reactions.findIndex(r => 
          r.reaction === reaction && r.sender === 'user'
        );
        
        if (existingReactionIndex > -1) {
          const newReactions = [...msg.reactions];
          newReactions.splice(existingReactionIndex, 1);
          return { ...msg, reactions: newReactions };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { reaction, sender: 'user', timestamp: new Date().toISOString() }]
          };
        }
      }
      return msg;
    }));

    setShowReactionMenu(false);
    setSelectedMessage(null);
  };

  const handlePinMessage = () => {
    if (!selectedMessage) return;
    
    setPinnedMessages(prev => {
      const newPinned = new Set(prev);
      if (newPinned.has(selectedMessage.id)) {
        newPinned.delete(selectedMessage.id);
      } else {
        newPinned.add(selectedMessage.id);
      }
      return newPinned;
    });

    setShowReactionMenu(false);
    setSelectedMessage(null);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderPinnedMessages = () => {
    const pinned = messages.filter(msg => pinnedMessages.has(msg.id));
    if (pinned.length === 0) return null;

    return (
      <View style={styles.pinnedSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pinnedList}
        >
          {pinned.map(msg => (
            <Pressable
              key={msg.id}
              style={styles.pinnedCard}
              onPress={() => {
                // TODO: Scroll to message
                console.log('Scroll to message:', msg.id);
              }}
            >
              <Text style={styles.pinnedText} numberOfLines={2}>
                {msg.text}
              </Text>
              <Text style={styles.pinnedTime}>{formatTime(msg.timestamp)}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.9}
      style={[
        styles.messageRow,
        item.sender === 'user' ? styles.userMessageRow : styles.friendMessageRow
      ]}
    >
      {item.sender !== 'user' && (
        <Image
          source={params.avatar}
          style={styles.messageAvatar}
          contentFit="cover"
        />
      )}
      <View>
        <View style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.friendBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.sender === 'user' ? styles.userMessageText : styles.friendMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            item.sender === 'user' ? styles.userMessageTime : styles.friendMessageTime
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
        {item.reactions.length > 0 && (
          <View style={[
            styles.reactionsContainer,
            item.sender === 'user' ? styles.userReactions : styles.friendReactions
          ]}>
            {item.reactions.map((reaction, index) => (
              <Text key={index} style={styles.reactionBadge}>
                {reaction.reaction}
              </Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const handleSend = () => {
    if (!message.trim()) return;
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Pressable 
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#000" />
            </Pressable>
            <Image
              source={params.avatar}
              style={styles.avatar}
              contentFit="cover"
              transition={1000}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>{params.name}</Text>
              <Text style={styles.userUsername} numberOfLines={1}>{params.username}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={[
              styles.balanceAmount,
              { color: params.balance >= 0 ? '#38b000' : '#ff0000' }
            ]}>
              {params.balance >= 0 ? '+' : '-'}${Math.abs(params.balance)}
            </Text>
            <Pressable 
              style={styles.settleButton}
              onPress={() => console.log('Settle up')}
            >
              <Ionicons name="wallet-outline" size={16} color={colors.primary} />
            </Pressable>
            <Pressable 
              style={styles.iconButton}
              onPress={() => router.push({
                pathname: '/chat-settings',
                params: { ...params }
              })}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color="#000" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Pinned Messages */}
      {renderPinnedMessages()}

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
      />

      {/* Reaction Menu Modal */}
      <Modal
        visible={showReactionMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReactionMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowReactionMenu(false)}
        >
          <View style={styles.reactionMenu}>
            <View style={styles.reactionList}>
              {reactions.map((reaction) => (
                <TouchableOpacity
                  key={reaction}
                  style={styles.reactionButton}
                  onPress={() => handleReaction(reaction)}
                >
                  <Text style={styles.reactionEmoji}>{reaction}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handlePinMessage}
            >
              <Ionicons 
                name="pin" 
                size={20} 
                color={colors.primary}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>
                {pinnedMessages.has(selectedMessage?.id) ? 'Unpin Message' : 'Pin Message'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <Pressable style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
          </Pressable>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            multiline
            maxLength={500}
          />
          <Pressable 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={message.trim() ? colors.primary : '#ccc'} 
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 1,
  },
  userUsername: {
    fontSize: 12,
    color: '#666',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  settleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}15`,
  },
  messagesList: {
    padding: 16,
    gap: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessageRow: {
    alignSelf: 'flex-end',
  },
  friendMessageRow: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  friendBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  friendMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  friendMessageTime: {
    color: '#666',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 12,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    color: '#000',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  pinnedSection: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    maxHeight: 100,
  },
  pinnedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 4,
    gap: 4,
  },
  pinnedTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  pinnedList: {
    paddingHorizontal: 8,
    gap: 6,
  },
  pinnedCard: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 6,
    maxWidth: 140,
    minWidth: 100,
    borderWidth: 1,
    borderColor: `${colors.primary}15`,
  },
  pinnedText: {
    fontSize: 12,
    color: '#000',
    lineHeight: 16,
    marginBottom: 2,
  },
  pinnedTime: {
    fontSize: 10,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionMenu: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '80%',
    maxWidth: 300,
  },
  reactionList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 16,
  },
  reactionButton: {
    padding: 8,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  reactionEmoji: {
    fontSize: 20,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  userReactions: {
    justifyContent: 'flex-end',
  },
  friendReactions: {
    justifyContent: 'flex-start',
  },
  reactionBadge: {
    fontSize: 14,
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
}); 