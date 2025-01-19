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
      id: 'm1',
      text: 'Hey, can you settle up for the dinner?',
      sender: 'user',
      timestamp: '2024-03-25T20:30:00Z',
      reactions: [],
    },
    {
      id: 'm2',
      text: 'Sure! Let me check the amount',
      sender: params.id,
      timestamp: '2024-03-25T20:31:00Z',
      reactions: [],
    },
    {
      id: 'm3',
      text: 'It was $45 for your share',
      sender: 'user',
      timestamp: '2024-03-25T20:31:30Z',
      reactions: [],
    },
    {
      id: 'm4',
      text: 'Perfect, transfer it right now',
      sender: params.id,
      timestamp: '2024-03-25T20:32:00Z',
      reactions: [],
    },
  ]);

  const handleLongPress = (message) => {
    setSelectedMessage(message);
    setShowReactionMenu(true);
  };

  const handleReaction = (reaction) => {
    if (!selectedMessage) return;

    setMessages(messages.map(msg => {
      if (msg.id === selectedMessage.id) {
        const existingReactionIndex = msg.reactions.findIndex(r => 
          r.reaction === reaction && r.sender === 'user'
        );
        
        if (existingReactionIndex > -1) {
          // Remove existing reaction
          const newReactions = [...msg.reactions];
          newReactions.splice(existingReactionIndex, 1);
          return { ...msg, reactions: newReactions };
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...msg.reactions, { reaction, sender: 'user' }]
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
        <View style={styles.pinnedHeader}>
          <Ionicons name="pin" size={16} color={colors.primary} />
          <Text style={styles.pinnedTitle}>Pinned Messages</Text>
          <Text style={styles.pinnedCount}>{pinned.length}</Text>
        </View>
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
              <View style={styles.pinnedCardHeader}>
                <Ionicons name="pin" size={14} color={colors.primary} />
                <Text style={styles.pinnedTime}>{formatTime(msg.timestamp)}</Text>
              </View>
              <Text style={styles.pinnedText} numberOfLines={2}>
                {msg.text}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.8}
      delayLongPress={200}
    >
      <View style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.friendMessage
      ]}>
        {item.sender !== 'user' && (
          <Image
            source={params.avatar}
            style={styles.messageAvatar}
            contentFit="cover"
          />
        )}
        <View style={styles.messageContent}>
          <View style={[
            styles.messageBubble,
            item.sender === 'user' ? styles.userBubble : styles.friendBubble
          ]}>
            {pinnedMessages.has(item.id) && (
              <View style={[
                styles.pinIndicator,
                item.sender === 'user' ? styles.userPinIndicator : styles.friendPinIndicator
              ]}>
                <Ionicons 
                  name="pin" 
                  size={12} 
                  color={colors.primary}
                />
              </View>
            )}
            <Text style={[
              styles.messageText,
              item.sender === 'user' ? styles.userMessageText : styles.friendMessageText
            ]}>
              {item.text}
            </Text>
          </View>
          <Text style={[
            styles.messageTime,
            item.sender === 'user' ? styles.userMessageTime : styles.friendMessageTime
          ]}>
            {formatTime(item.timestamp)}
          </Text>
          {item.reactions.length > 0 && (
            <View style={[
              styles.reactionsContainer,
              item.sender === 'user' ? styles.userReactions : styles.friendReactions
            ]}>
              {item.reactions.map((reaction, index) => (
                <View key={index} style={styles.reactionBadge}>
                  <Text style={styles.reactionEmoji}>{reaction.reaction}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleSend = () => {
    if (!message.trim()) return;
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable 
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Pressable 
            style={styles.userInfo}
            onPress={() => router.push({
              pathname: '/chat-settings',
              params: {
                id: params.id,
                name: params.name,
                username: params.username,
                avatar: params.avatar,
                balance: params.balance
              }
            })}
          >
            <Image
              source={params.avatar}
              style={styles.avatar}
              contentFit="cover"
              transition={1000}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.headerName}>{params.name}</Text>
              <Text style={styles.headerUsername}>{params.username}</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.headerRight}>
          <Pressable 
            style={styles.iconButton}
            onPress={() => router.push({
              pathname: '/chat-settings',
              params: {
                id: params.id,
                name: params.name,
                username: params.username,
                avatar: params.avatar,
                balance: params.balance
              }
            })}
          >
            <Ionicons name="settings" size={22} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={[
            styles.balanceAmount,
            { color: params.balance >= 0 ? '#38b000' : '#ff0000' }
          ]}>
            {params.balance >= 0 ? '+' : '-'}${Math.abs(params.balance)}
          </Text>
        </View>
        <Pressable 
          style={styles.settleButton}
          onPress={() => console.log('Settle up')}
        >
          <Ionicons name="wallet" size={20} color="white" style={{ marginRight: 4 }} />
          <Text style={styles.settleButtonText}>Settle Up</Text>
        </Pressable>
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
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
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
              color={message.trim() ? 'white' : '#666'} 
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
    backgroundColor: '#f9faf9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}10`,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: `${colors.primary}30`,
  },
  nameContainer: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  headerUsername: {
    fontSize: 13,
    color: '#666',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '600',
  },
  settleButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settleButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  messagesList: {
    padding: 16,
    gap: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 8,
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: 4,
  },
  messageContent: {
    flex: 1,
    maxWidth: '80%',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  friendMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  friendBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    marginRight: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pinIndicator: {
    position: 'absolute',
    top: -8,
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userPinIndicator: {
    right: 8,
  },
  friendPinIndicator: {
    left: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  friendMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  userMessageTime: {
    color: '#666',
    textAlign: 'right',
    marginRight: 4,
  },
  friendMessageTime: {
    color: '#666',
    marginLeft: 4,
  },
  reactionsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  userReactions: {
    justifyContent: 'flex-end',
  },
  friendReactions: {
    justifyContent: 'flex-start',
  },
  reactionBadge: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    minWidth: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  reactionEmoji: {
    fontSize: 12,
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
  pinnedSection: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  pinnedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  pinnedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
  },
  pinnedCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pinnedList: {
    paddingHorizontal: 12,
    gap: 12,
  },
  pinnedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    maxWidth: 200,
    minWidth: 150,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  pinnedCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pinnedText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  pinnedTime: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    padding: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 48,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
}); 