import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useUsers } from '../hooks/useUsers';
import { useToast } from '../hooks/useToast';
import { Modal } from '../components/Modal';

const IBGE_API_URL = import.meta.env.VITE_IBGE_API_URL;
const ibgeCache: Record<string, string[]> = {};

const stateList = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

type UserFormData = {
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
};

const schema = yup.object({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().email('Email inválido').required('Email obrigatório'),
  phone: yup.string().required('Telefone obrigatório'),
  state: yup.string().required('Estado obrigatório'),
  city: yup.string().required('Cidade obrigatória'),
}).required();

export const UserFormPage: React.FC = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(isEdit);
  const [cities, setCities] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<UserFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createUser, updateUser, getUser } = useUsers();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isDirty, isValid }
  } = useForm<UserFormData>({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
  });

  const watchState = useWatch({ control, name: 'state' }) || '';
  const watchCity = useWatch({ control, name: 'city' }) || '';
  const previousState = React.useRef(watchState);

  useEffect(() => {
    let ignore = false;
    if (watchState) {
      const applyCities = (cityNames: string[]) => {
        // Se o estado mudou (não é o carregamento inicial), precisamos limpar a cidade
        if (previousState.current && previousState.current !== watchState) {
          setCities(cityNames);
          setTimeout(() => setValue('city', ''), 0);
        } else {
          const currentCity = control._formValues.city;
          if (currentCity && !cityNames.includes(currentCity)) {
            setCities([currentCity, ...cityNames]);
          } else {
            setCities(cityNames);
          }

          if (currentCity) {
            setTimeout(() => setValue('city', currentCity), 0);
          }
        }
        previousState.current = watchState;
      };

      if (ibgeCache[watchState]) {
        applyCities(ibgeCache[watchState]);
      } else {
        axios.get(`${IBGE_API_URL}/estados/${watchState}/municipios`)
          .then(res => {
            if (!ignore) {
              const cityNames = res.data.map((c: { nome: string }) => c.nome);
              ibgeCache[watchState] = cityNames;
              applyCities(cityNames);
            }
          });
      }
    }
    return () => { ignore = true; };
  }, [watchState, control, setValue]);


  useEffect(() => {
    if (isEdit && id) {
      setIsLoading(true);
      getUser(id)
        .then(user => {
          let uf = user.state || '';
          let cidade = user.city;

          if (user.city?.includes('|')) {
            const parts = user.city.split('|');
            uf = parts[0];
            cidade = parts[1];
          }

          reset({
            name: user.name,
            email: user.email,
            phone: user.phone,
            state: uf,
            city: cidade,
          });
        })
        .catch(() => {
          addToast('Erro ao carregar usuário', 'error');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEdit, setValue, addToast, getUser]);

  const onFormSubmit = (data: UserFormData) => {
    const dataToSend = {
      ...data,
      city: `${data.state}|${data.city}`,
    };

    if (isEdit) {
      setPendingData(dataToSend);
      setShowConfirmModal(true);
    } else {
      executeSubmit(dataToSend);
    }
  };

  const executeSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      if (isEdit && id) {
        await updateUser(Number(id), data);
        addToast('Atualizado com sucesso!', 'success');
      } else {
        await createUser(data);
        addToast('Criado com sucesso!', 'success');
      }

      navigate('/users');
    } catch (err) {
      const error = err as { response?: { data?: { error?: string; message?: string } } };
      const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao salvar';
      addToast(apiError, 'error');
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const isSubmitDisabled = isSubmitting || !isValid || (isEdit && !isDirty);

  return (
    <Layout>
      <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
        <form onSubmit={handleSubmit(onFormSubmit as any)} className="card">
          <h2>{isEdit ? 'Editar' : 'Novo'} Usuário</h2>

          {isLoading ? (
            <>
              <div className="input-group">
                <div className="skeleton skeleton-text" style={{ width: '25%' }}></div>
                <div className="skeleton skeleton-input"></div>
              </div>
              <div className="input-group">
                <div className="skeleton skeleton-text" style={{ width: '35%' }}></div>
                <div className="skeleton skeleton-input"></div>
              </div>
              <div className="input-group">
                <div className="skeleton skeleton-text" style={{ width: '20%' }}></div>
                <div className="skeleton skeleton-input"></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div className="skeleton skeleton-input" style={{ flex: 1, height: '2.75rem' }}></div>
                <div className="skeleton skeleton-input" style={{ flex: 2, height: '2.75rem' }}></div>
              </div>
              <div className="skeleton skeleton-input" style={{ width: '100%', height: '2.75rem' }}></div>
            </>
          ) : (
            <>
              <Input label="Nome" placeholder="Ex: João Silva" {...register('name')} error={errors.name?.message} />
              <Input label="Email" placeholder="Ex: joao@email.com" {...register('email')} error={errors.email?.message} />
              <Input label="Telefone" placeholder="Ex: 11999999999" {...register('phone')} error={errors.phone?.message} />

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label" htmlFor="state">Estado</label>
                  <select id="state" className="input-field" {...register('state')} value={watchState || ''}>
                    <option value="" disabled>Estado</option>
                    {stateList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ flex: 2 }}>
                  <label className="input-label" htmlFor="city">Cidade</label>
                  <select
                    id="city"
                    className="input-field"
                    {...register('city')}
                    value={watchCity || ''}
                  >
                    <option value="" disabled>Selecione a cidade</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="button" style={{ flex: 1 }} variant="secondary" onClick={() => navigate(-1)} disabled={isSubmitting}>
                  Voltar
                </Button>
                <Button type="submit" style={{ flex: 2 }} disabled={isSubmitDisabled}>
                  {isSubmitting ? 'Salvando...' : (isEdit ? 'Salvar' : 'Cadastrar')}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>

      <Modal
        isOpen={showConfirmModal}
        title="Confirmar"
        message="Salvar alterações?"
        onConfirm={() => pendingData && executeSubmit(pendingData)}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={isSubmitting}
      />
    </Layout>
  );
};