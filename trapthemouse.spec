Name:		trapthemouse
Version:	0.0.1
Release:	1%{?dist}
Summary:	Simple puzzle game. Set the tiles to block the mouse's reaching the cheese.
Group:
License:	BSD
URL:
Source0:
BuildRoot:	%{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)

BuildRequires:
Requires:

%description

%prep
%setup -q

%build
%configure
make %{?_smp_mflags}

%install
rm -rf %{buildroot}
make install DESTDIR=%{buildroot}

%clean
rm -rf %{buildroot}

%files
%defattr(-,root,root,-)
%doc

%changelog
