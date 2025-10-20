import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUserPassword, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // This page is only accessible when the user has followed a password recovery link,
    // which signs them in temporarily via a token in the URL. If the auth state is
    // finished loading and there